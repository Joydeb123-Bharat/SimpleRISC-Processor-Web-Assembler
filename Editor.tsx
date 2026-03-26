"use client";

import React from "react";
import MonacoEditor, { OnMount } from "@monaco-editor/react";

interface EditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  onCursorChange?: (line: number) => void;
}

export default function Editor({ code, onChange, onCursorChange }: EditorProps) {
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editor.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        onCursorChange(e.position.lineNumber);
      }
    });
  };

  return (
    <div className="h-full w-full rounded-md border border-borderDark overflow-hidden glass-panel flex flex-col">
      <div className="bg-panel px-4 py-2 text-sm text-textMain border-b border-borderDark font-medium flex justify-between items-center">
        <span>SimpleRISC Source Editor (input.s)</span>
      </div>
      <div className="flex-grow">
        <MonacoEditor
          height="100%"
          language="assembly"
          theme="vs-dark"
          value={code}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "var(--font-fira-code)",
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            padding: { top: 16 },
            lineNumbersMinChars: 3,
            glyphMargin: false,
            folding: false
          }}
        />
      </div>
    </div>
  );
}
