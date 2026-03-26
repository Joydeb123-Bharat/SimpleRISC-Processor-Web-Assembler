"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface DiagnosticConsoleProps {
  message: string;
  isError: boolean;
}

export default function DiagnosticConsole({ message, isError }: DiagnosticConsoleProps) {
  return (
    <div className="h-full flex flex-col rounded-md border border-borderDark glass-panel overflow-hidden">
      <div className="bg-panel px-4 py-2 text-sm text-textMain border-b border-borderDark font-medium flex gap-4">
        <span>Diagnostic Console</span>
        <span className="text-textDim opacity-50">Messages</span>
        <span className="text-textDim opacity-50">Diagnostic</span>
      </div>
      <div className="flex-1 overflow-y-auto w-full p-4 font-mono text-sm">
        {message ? (
          <div className={`flex gap-3 items-start ${isError ? 'text-warning' : 'text-textDim'}`}>
            {isError && <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
            <span className="whitespace-pre-wrap">{message}</span>
          </div>
        ) : (
          <div className="text-textDim opacity-50 italic">Waiting for assembly...</div>
        )}
      </div>
    </div>
  );
}
