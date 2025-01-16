import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '../../utils/cn';
import { ExportMenu } from './ExportMenu';
import type { ExportFormat } from '../../utils/exportUtils';

interface FileActionsProps {
  onImport: (xml: string) => void;
  onExport: (format: ExportFormat) => void;
}

export function FileActions({ onImport, onExport }: FileActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onImport(content);
        };
        reader.readAsText(file);
      } catch (error) {
        console.error('Error reading file:', error);
        alert('Failed to read the file. Please try again.');
      }
    }
  };

  const buttonClass = cn(
    "flex items-center gap-1.5 px-3 py-1.5 rounded-md",
    "text-sm font-medium",
    "hover:bg-gray-100 transition-colors"
  );

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".bpmn,.xml"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className={buttonClass}
        title="Import BPMN file"
      >
        <Upload className="w-4 h-4" />
        Import
      </button>
      <ExportMenu onExport={onExport} />
    </div>
  );
}