import React from 'react';
import { FileActions } from './FileActions';
import { CanvasActions } from './CanvasActions';
import { ShortcutsHelp } from './ShortcutsHelp';
import type { ExportFormat } from '../../utils/exportUtils';

interface TopBarProps {
  onImport: (xml: string) => void;
  onExport: (format: ExportFormat) => void;
  onClear: () => void;
}

export function TopBar({ onImport, onExport, onClear }: TopBarProps) {
  return (
    <div className="bg-white border-b shadow-sm px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-800">NEXORA</h1>
          <div className="h-6 w-px bg-gray-200" />
        </div>
        <div className="flex items-center gap-2">
          <FileActions onImport={onImport} onExport={onExport} />
          <div className="h-6 w-px bg-gray-200" />
          <CanvasActions onClear={onClear} />
          <div className="h-6 w-px bg-gray-200" />
          <ShortcutsHelp />
        </div>
      </div>
    </div>
  );
}