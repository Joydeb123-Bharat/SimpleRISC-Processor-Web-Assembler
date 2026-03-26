"use client";

import React from "react";

interface InstructionFormatProps {
  instruction?: {
    binary: string;
    instruction: string;
  };
}

export default function InstructionFormat({ instruction }: InstructionFormatProps) {
  const binary = instruction?.binary || "";
  const hasBinary = binary.length === 32;

  // Slices
  const opcode = hasBinary ? binary.slice(0, 5) : "Opcode";
  const iBit = hasBinary ? binary.slice(5, 6) : "I";
  const rd = hasBinary ? binary.slice(6, 10) : "Rd";
  const rs1 = hasBinary ? binary.slice(10, 14) : "Rs1";
  
  let restLabel = "Rs2/Imm16";
  let restValue = "Rs2/Imm16";
  let paddingValue = "...";

  if (hasBinary) {
    if (iBit === "1") {
      const mod = binary.slice(14, 16);
      const imm = binary.slice(16, 32);
      restValue = `${mod} | ${imm}`;
      paddingValue = ""; // used all 32 bits
    } else {
      const rs2 = binary.slice(14, 18);
      restValue = rs2;
      paddingValue = binary.slice(18, 32);
    }
  }

  // Handle Branches (Type 1) which use a 27 bit offset
  const isBranch = hasBinary && ["10000", "10001", "10010", "10011", "10100"].includes(opcode);
  if (isBranch) {
    const offset = binary.slice(5, 32);
    return (
      <div className="h-full flex flex-col rounded-md border border-borderDark glass-panel overflow-hidden">
        <div className="bg-panel px-4 py-2 text-sm text-textMain border-b border-borderDark font-medium flex justify-between">
          <span>Instruction Encoding</span>
          {instruction && <span className="text-accent font-mono text-xs">{instruction.instruction.toUpperCase()}</span>}
        </div>
        <div className="flex-1 flex flex-col justify-center px-4 w-full">
          <div className="flex w-full mb-1 text-xs text-textDim tracking-wider px-[1px]">
            <div className="flex-[0.5]">0</div>
            <div className="flex-[2.7] flex justify-between">
              <span>5</span>
              <span>32 bit</span>
            </div>
          </div>
          <div className="flex w-full h-10 group relative mt-1 border border-borderDark rounded-sm overflow-hidden text-[10px] md:text-xs font-mono select-none">
            <div className="flex-[0.5] border-r border-borderDark hover:bg-accent/20 transition-colors flex flex-col items-center justify-center text-accent">
              <span className="opacity-50 text-[10px]">OPCODE</span>
              <span>{opcode}</span>
            </div>
            <div className="flex-[2.7] border-r border-borderDark bg-blue-900/10 hover:bg-blue-900/30 transition-colors flex flex-col items-center justify-center text-blue-300">
              <span className="opacity-50 text-[10px]">OFFSET (27-bit)</span>
              <span>{offset}</span>
            </div>
          </div>
          <div className="flex justify-center mt-2 pb-2">
            <span className="text-[10px] text-textDim uppercase tracking-widest opacity-60">Type-1 (Branch/Jump) Format</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col rounded-md border border-borderDark glass-panel overflow-hidden">
      <div className="bg-panel px-4 py-2 text-sm text-textMain border-b border-borderDark font-medium flex justify-between">
        <span>Instruction Encoding</span>
        {instruction && <span className="text-accent font-mono text-xs">{instruction.instruction.toUpperCase()}</span>}
      </div>
      <div className="flex-1 flex flex-col justify-center px-4 w-full overflow-x-auto">
        <div className="flex w-full mb-1 text-xs text-textDim tracking-wider min-w-[400px] px-[1px]">
          <div className="flex-[0.5]">0</div>
          <div className="flex-[0.1]">5</div>
          <div className="flex-[0.4]">6</div>
          <div className="flex-[0.4]">10</div>
          <div className={`flex-[1.8] ${hasBinary && paddingValue === "" ? "flex justify-between" : ""}`}>
            <span>14</span>
            {hasBinary && paddingValue === "" && <span>32 bit</span>}
          </div>
          {(!hasBinary || paddingValue !== "") && (
            <div className="flex-[1.4] text-right">
              32 bit
            </div>
          )}
        </div>
        
        <div className="flex w-full h-10 group relative mt-1 border border-borderDark rounded-sm overflow-hidden text-[10px] md:text-xs font-mono select-none min-w-[400px]">
          {/* Opcode */}
          <div className="flex-[0.5] border-r border-borderDark hover:bg-accent/20 transition-colors flex flex-col items-center justify-center text-accent ring-inset ring-accent/30 hover:ring-1">
            {hasBinary && <span className="opacity-50 text-[10px] leading-none mb-1">OP</span>}
            <span className={!hasBinary ? "glow-text-primary" : ""}>{opcode}</span>
          </div>
          {/* I Bit */}
          <div className="flex-[0.1] border-r border-borderDark hover:bg-purple-500/20 transition-colors flex flex-col items-center justify-center text-purple-300 ring-inset ring-purple-500/30 hover:ring-1">
            {hasBinary && <span className="opacity-50 text-[10px] leading-none mb-1">I</span>}
            <span>{iBit}</span>
          </div>
          {/* Rd */}
          <div className="flex-[0.4] border-r border-borderDark hover:bg-primary/20 transition-colors flex flex-col items-center justify-center text-primary ring-inset ring-primary/30 hover:ring-1">
            {hasBinary && <span className="opacity-50 text-[10px] leading-none mb-1">RD</span>}
            <span>{rd}</span>
          </div>
          {/* Rs1 */}
          <div className="flex-[0.4] border-r border-borderDark hover:bg-primary/20 transition-colors flex flex-col items-center justify-center text-primary ring-inset ring-primary/30 hover:ring-1">
             {hasBinary && <span className="opacity-50 text-[10px] leading-none mb-1">RS1</span>}
            <span>{rs1}</span>
          </div>
          {/* Rs2 / Imm */}
          <div className="flex-[1.8] border-r border-borderDark bg-blue-900/10 hover:bg-blue-900/30 transition-colors flex flex-col items-center justify-center text-blue-300 ring-inset ring-blue-500/30 hover:ring-1">
            {hasBinary && <span className="opacity-50 text-[10px] leading-none mb-1">{iBit === "1" ? "MOD | IMM16" : "RS2"}</span>}
            <span>{restValue}</span>
          </div>
          {/* Padding */}
          {(!hasBinary || paddingValue !== "") && (
            <div className="flex-[1.4] hover:bg-gray-800/50 transition-colors flex flex-col items-center justify-center text-textDim bg-gray-900/30">
               {hasBinary && <span className="opacity-50 text-[10px] leading-none mb-1">PADDING (Zeros)</span>}
              <span>{paddingValue}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-2 pb-2">
          <span className="text-[10px] text-textDim uppercase tracking-widest opacity-60">SimpleRISC {hasBinary ? (iBit === "1" ? "I-Type" : "R-Type") : "Format"} Details</span>
        </div>
      </div>
    </div>
  );
}
