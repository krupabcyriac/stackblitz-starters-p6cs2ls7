import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '../../utils/cn';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isInterim?: boolean;
  placeholder?: string;
  isAnalyzing?: boolean;
}

export function MessageInput({
  value,
  onChange,
  disabled,
  isInterim,
  isAnalyzing,
  placeholder = 'Type your message here...',
}: MessageInputProps) {
  return (
    <div className="relative flex-1">
      {isAnalyzing && (
        <div className="absolute inset-0 bg-blue-50 rounded-lg flex items-center justify-center z-10">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-blue-600">Analyzing image...</span>
          </div>
        </div>
      )}
      <TextareaAutosize
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        minRows={1}
        maxRows={8}
        className={cn(
          "w-full px-4 py-3 text-base",
          "border rounded-lg shadow-sm",
          "bg-white text-gray-900 placeholder-gray-400",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          isInterim && "border-blue-300 bg-blue-50",
          disabled && "bg-gray-50 text-gray-500",
          value.length > 0 && "pr-12",
        )}
        disabled={disabled || isAnalyzing}
      />
      {value.length > 0 && (
        <div className="absolute bottom-2 right-2 px-2 py-1 text-xs text-gray-400 bg-white/80 rounded">
          {value.length}
        </div>
      )}
    </div>
  );
}