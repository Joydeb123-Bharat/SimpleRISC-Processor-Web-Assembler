"use client";

import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface SymbolTableProps {
  symbols: Record<string, number>;
  success: boolean | null;
  message: string;
}

export default function SymbolTable({ symbols, success, message }: SymbolTableProps) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Symbol Table */}
      <div className="flex-1 flex flex-col rounded-md border border-borderDark glass-panel overflow-hidden">
        <div className="bg-panel px-4 py-2 text-sm text-textMain border-b border-borderDark font-medium">
          Status & Symbol Table
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {Object.keys(symbols).length === 0 ? (
            <div className="text-textDim text-sm italic p-2 rounded-md">
              No symbols defined.
            </div>
          ) : (
            <div className="flex flex-col gap-[2px]">
              {Object.entries(symbols).map(([label, pc], idx) => (
                <div 
                  key={label}
                  className={`flex justify-between text-sm px-3 py-1.5 rounded-sm ${
                    idx % 2 === 0 ? 'bg-primary/20 text-blue-200' : 'bg-accent/20 text-purple-200'
                  }`}
                >
                  <span className="font-mono">{label}</span>
                  <span className="font-mono">0x{pc.toString(16).padStart(4, '0').toUpperCase()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Status Box */}
      {success !== null && (
        <div className={`rounded-md border p-3 flex items-center gap-3 backdrop-blur-md ${
          success 
            ? 'bg-success/10 border-success/30 text-green-300' 
            : 'bg-error/10 border-error/30 text-red-300'
        }`}>
          {success ? <CheckCircle size={28} className="text-success shrink-0" /> : <XCircle size={28} className="text-error shrink-0" />}
          <div className="flex flex-col">
            <span className="font-semibold text-sm">
              {success ? "Compilation Successful" : "Compilation Failed"}
            </span>
            <span className="text-xs opacity-80 whitespace-pre-line">
              {message.split('\n')[1] || message} {/* Display second line if present (e.g. 0 errors) */}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
