import traceback

isa_opcodes = {
    "ADD":  "00000", "SUB":  "00001", "MUL":  "00010", "DIV":  "00011",
    "MOD":  "00100", "CMP":  "00101", "AND":  "00110", "OR":   "00111",
    "NOT":  "01000", "MOV":  "01001", "LSL":  "01010", "LSR":  "01011",
    "ASR":  "01100", "NOP":  "01101", "LD":   "01110", "ST":   "01111",
    "BEQ":  "10000", "BGT":  "10001", "B":    "10010", "CALL": "10011",
    "RET":  "10100", "XOR":  "10101", "HLT":  "10110"
}

registers = {
    "R0":  "0000", "R1":  "0001", "R2":  "0010", "R3":  "0011",
    "R4":  "0100", "R5":  "0101", "R6":  "0110", "R7":  "0111",
    "R8":  "1000", "R9":  "1001", "R10": "1010", "R11": "1011",
    "R12": "1100", "R13": "1101", "R14": "1110", "R15": "1111"
}

def read_from_text(user_code):
    lines = []
    for i, line in enumerate(user_code.split('\n')):
        no_comments = line.split('//')[0]
        clean_line = no_comments.strip().upper()
        if clean_line:
            lines.append({'text': clean_line, 'line_num': i + 1})
    return lines

def first_pass(lines):
    symbol_table = {}
    clean_instructions = []
    pc = 0
    for item in lines:
        line = item['text']
        line_num = item['line_num']
        if ':' in line:
            parts = line.split(':')
            label_name = parts[0].strip()
            symbol_table[label_name] = pc
            instruction = parts[1].strip()
        else:
            instruction = line.strip()

        if instruction:
            clean_instructions.append({'instruction': instruction, 'line_num': line_num})
            pc += 4
    return symbol_table, clean_instructions

def parse_line(line):
    clean_line = line.replace(',', ' ').replace('[', ' ').replace(']', ' ')
    parts = clean_line.split()
    return parts

def dec_to_bin(num_str, bits):
    # Support for decimal as well as hexadecimal strings like 0x1A
    try:
        if str(num_str).upper().startswith("0X") or str(num_str).upper().startswith("-0X"):
            num = int(str(num_str), 16)
        else:
            num = int(str(num_str))
    except ValueError:
        raise ValueError(f"Invalid integer format: {num_str}")
    
    if num >= 0:
        return format(num, f'0{bits}b')
    else:
        return format((1 << bits) + num, f'0{bits}b')

def ass_0_type(parts):
    opcode = isa_opcodes[parts[0]]
    padding = "0" * 27
    return opcode + padding

def ass_1_type(parts, current_pc, symbol_table):
    if parts[1] in symbol_table:
        offset_int = int((symbol_table[parts[1]] - current_pc) / 4)
    else:
        if str(parts[1]).upper().startswith("0X") or str(parts[1]).upper().startswith("-0X"):
            offset_int = int(str(parts[1]), 16)
        else:
            offset_int = int(parts[1])
    offset_bin = dec_to_bin(str(offset_int), 27)
    opcode = isa_opcodes[parts[0]]
    return opcode + offset_bin

def ass_2_type_mov_not(parts, modifier):
    opcode = isa_opcodes[parts[0]]
    rd = registers[parts[1]]
    empty_rs1 = "0000"
    if parts[2] in registers:
        r_i = "0"
        rs2 = registers[parts[2]]
        padding = "0" * 14
        return opcode + r_i + rd + empty_rs1 + rs2 + padding
    else:
        r_i = "1"
        mod = "00"
        if modifier == 'U':
            mod = "01"
        elif modifier == 'H':
            mod = "10"
        imm = dec_to_bin(parts[2], 16)
        return opcode + r_i + rd + empty_rs1 + mod + imm

def ass_2_type_cmp(parts):
    opcode = isa_opcodes[parts[0]]
    rd = "0000"
    rs1 = registers[parts[1]]
    if parts[2] in registers:
        r_i = "0"
        rs2 = registers[parts[2]]
        padding = "0" * 14
        return opcode + r_i + rd + rs1 + rs2 + padding
    else:
        r_i = "1"
        imm = dec_to_bin(parts[2], 18)
        return opcode + r_i + rd + rs1 + imm

def ass_r_type(parts):
    opcode = isa_opcodes[parts[0]]
    r = "0"
    rd = registers[parts[1]]
    rs1 = registers[parts[2]]
    rs2 = registers[parts[3]]
    padding = "0" * 14
    return opcode + r + rd + rs1 + rs2 + padding

def ass_i_type(parts, modifier):
    opcode = isa_opcodes[parts[0]]
    i = "1"
    rd = registers[parts[1]]
    rs1 = registers[parts[2]]
    mod = "00"
    if modifier == 'U':
        mod = "01"
    elif modifier == 'H':
        mod = "10"
    imm = dec_to_bin(parts[3], 16)
    return opcode + i + rd + rs1 + mod + imm

def ass_mem_type(parts, modifier):
    opcode = isa_opcodes[parts[0]]
    r_i = "1"
    rd = registers[parts[1]]
    mod = "00"
    if modifier == 'U':
        mod = "01"
    elif modifier == 'H':
        mod = "10"
    imm = dec_to_bin(parts[2], 16)
    rs1 = registers[parts[3]]
    return opcode + r_i + rd + rs1 + mod + imm

def assemble_instruction(parts, current_pc, symbol_table):
    modifier = "N"

    if parts[0][-1] in ["U", "H"] and parts[0][:-1] in isa_opcodes:
        modifier = parts[0][-1]
        parts[0] = parts[0][:-1]

    if len(parts) == 1:
        return ass_0_type(parts)

    elif len(parts) == 2:
        return ass_1_type(parts, current_pc, symbol_table)

    elif len(parts) == 3:
        if parts[0] in ["MOV", "NOT"]:
            return ass_2_type_mov_not(parts, modifier)
        elif parts[0] == "CMP":
            return ass_2_type_cmp(parts)

    elif len(parts) == 4:
        if parts[0] in ["LD", "ST"]:
            return ass_mem_type(parts, modifier)
        elif parts[3] in registers:
            return ass_r_type(parts)
        else:
            return ass_i_type(parts, modifier)

    return "Invalid Instruction"

def run_assembler_from_text(user_code):
    lines = read_from_text(user_code)
    symbol_table, clean_instructions = first_pass(lines)

    machine_code = []
    data_output = []
    current_pc = 0

    for item in clean_instructions:
        instruction = item['instruction']
        line_num = item['line_num']
        parts = parse_line(instruction)
        try:
            binary32 = assemble_instruction(parts, current_pc, symbol_table)

            if binary32 == "Invalid Instruction":
                return False, f"Invalid instruction found on line {line_num}: {instruction}", [], symbol_table, []

            machine_code.append(binary32)
            hex_pc = f"0x{current_pc:04X}"
            hex_mc = f"0x{int(binary32, 2):08X}"

            data_output.append({
                "pc": hex_pc,
                "machine_code": hex_mc,
                "binary": binary32,
                "instruction": instruction.lower(),
                "source_line": line_num
            })

            current_pc += 4
        except Exception as e:
            err_msg = f"Error assembling instruction '{instruction}' on line {line_num}: {str(e)}\n{traceback.format_exc()}"
            return False, err_msg, [], symbol_table, []

    return True, f"Compilation Successful\nLines Processed: {len(clean_instructions)}", data_output, symbol_table, machine_code
