"use client";

import React from "react";
import { AlignJustify } from "lucide-react";

interface MachineCodeData {
  pc: string;
  machine_code: string;
  binary: string;
  instruction: string;
}

interface ViewerProps {
  data: MachineCodeData[];
}

export default function MachineCodeViewer({ data }: ViewerProps) {
  return (
    <div className="h-full flex flex-col rounded-md border border-borderDark glass-panel overflow-hidden">
      <div className="bg-panel px-4 py-2 text-sm text-textMain border-b border-borderDark font-medium flex justify-between items-center">
        <span>Machine Code Viewer</span>
        <AlignJustify size={16} className="text-textDim" />
      </div>
      
      <div className="flex-1 overflow-y-auto w-full p-4 font-mono text-sm leading-relaxed" style={{ fontSize: '13px' }}>
        {data.length === 0 ? (
          <div className="text-textDim italic flex items-center justify-center h-full">
            No machine code generated yet. Let's write some assembly!
          </div>
        ) : (
          <table className="w-full text-left table-fixed">
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
                  <td className="w-20 text-textDim shrink-0 font-bold tracking-wider">{row.pc}</td>
                  <td className="w-4 text-textDim text-center select-none">|</td>
                  
                  {/* The tooltip handles the binary view via 'title' attribute */}
                  <td 
                    title={`Binary: \n${row.binary.match(/.{1,4}/g)?.join(' ')}`}
                    className="w-32 text-primary font-bold cursor-help border-b border-transparent hover:border-primary transition-colors inline-block tracking-wider"
                  >
                    {row.machine_code}
                  </td>
                  
                  <td className="w-4 text-textDim text-center select-none">|</td>
                  <td className="pl-2 w-auto whitespace-pre truncate text-success tracking-wide">{row.instruction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
