"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Editor from "../components/Editor";
import MachineCodeViewer from "../components/MachineCodeViewer";
import SymbolTable from "../components/SymbolTable";
import DiagnosticConsole from "../components/DiagnosticConsole";
import InstructionFormat from "../components/InstructionFormat";
import { FolderOpen, Save, Play, Aperture, Settings } from "lucide-react";

export default function Home() {
  const [code, setCode] = useState<string>("add r1, r2, r3\nadd r4, r0, 100\ncmp r1, r4\nbgt loop\n\nloop:\n  add r1, r2, r3\n");
  const [machineCode, setMachineCode] = useState<any[]>([]);
  const [symbols, setSymbols] = useState<Record<string, number>>({});
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>("");
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const assembleCode = async () => {
    setMessage("Assembling...");
    setSuccess(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/assemble`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      setSuccess(data.success);
      setMessage(data.message);
      setMachineCode(data.data);
      setSymbols(data.symbol_table);
    } catch (err: any) {
      setSuccess(false);
      setMessage(`Network error connecting to assembler API:\n${err.message}`);
    }
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target?.result as string);
    };
    reader.readAsText(file);
    e.target.value = ""; // reset
  };

  const handleSave = () => {
    if (machineCode.length === 0) {
      alert("No machine code to save. Please assemble the code first.");
      return;
    }
    const hexContent = machineCode.map((mc) => mc.machine_code).join("\n");
    const blob = new Blob([hexContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "machine_code.hex";
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleRunSimulator = () => {
    alert("Simulator feature coming soon!");
  };

  const selectedInstruction = machineCode.find((mc) => mc.source_line === currentLine);

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1017]">
      {/* Header */}
      <header className="flex justify-between items-center p-3 px-6 border-b border-borderDark bg-[#0a0c10] flex-shrink-0">
        <div className="flex items-center gap-3">
          <Image src="/Logo.png" alt="SimpleRISC Logo" width={40} height={40} className="object-contain" />
          <h1 className="text-xl font-bold tracking-wider text-textMain hidden sm:block">
            SimpleRISC <span className="font-light text-textDim">Web Assembler v1.0</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <input type="file" ref={fileInputRef} onChange={handleLoad} className="hidden" accept=".s,.txt,.asm" />
          
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-borderDark text-sm text-textDim hover:text-primary hover:border-primary/50 transition-colors bg-panel/50">
            [ LOAD ] <FolderOpen size={16} />
          </button>

          <button onClick={handleSave} className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-borderDark text-sm text-textDim hover:text-primary hover:border-primary/50 transition-colors bg-panel/50">
            [ SAVE ] <Save size={16} />
          </button>

          <button 
            onClick={assembleCode} 
            className="flex items-center gap-2 px-5 py-2 rounded-md border border-accent/50 text-sm font-bold text-accent glow-btn-accent bg-accent/10 ml-2"
          >
            <Aperture size={18} className="animate-pulse" />
            [ ASSEMBLE ]
          </button>

          <button onClick={handleRunSimulator} className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-success/40 text-sm text-success hover:bg-success/10 transition-colors ml-4 bg-panel/50">
            <Play size={16} /> [ RUN SIMULATOR ]
          </button>
          
          <Settings size={20} className="text-textDim ml-4 cursor-pointer hover:text-white transition-colors" />
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 flex-shrink-0">
        
        {/* Left Pane - Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col min-h-[450px]">
          <Editor 
            code={code} 
            onChange={(v) => setCode(v || "")} 
            onCursorChange={(line) => setCurrentLine(line)}
          />
        </div>

        {/* Right Pane (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Top: Machine Code */}
          <div className="flex-[1.5] min-h-[250px] max-h-[450px]">
            <MachineCodeViewer data={machineCode} />
          </div>
          
          {/* Middle: Symbol Table & Status */}
          <div className="flex-1 min-h-[200px] max-h-[350px]">
            <SymbolTable symbols={symbols} success={success} message={message} />
          </div>
        </div>

      </main>

      {/* Footer / Consoles Area */}
      <footer className="p-4 pt-0 grid grid-cols-1 lg:grid-cols-12 gap-4 flex-shrink-0 min-h-[300px] mb-8">
        
        {/* Diagnostic Console */}
        <div className="lg:col-span-7 h-full min-h-[250px]">
          <DiagnosticConsole message={message} isError={success === false} />
        </div>

        {/* Instruction Format Guide */}
        <div className="lg:col-span-5 h-full min-h-[250px]">
          <InstructionFormat instruction={selectedInstruction} />
        </div>

      </footer>
    </div>
  );
}
