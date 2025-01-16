import React, { useState, useCallback, useRef } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';
import { VoiceInput } from './VoiceInput';
import { MessageInput } from './MessageInput';
import { ImageInput } from './ImageInput';
import { cn } from '../../utils/cn';
import { analyzeBPMNImage } from '../../services/ai/imageAnalysis';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageInput, setShowImageInput] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const voiceInputRef = useRef<{ stopListening: () => void }>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !isAnalyzing) {
      // Stop voice recording if active
      voiceInputRef.current?.stopListening();
      
      onSendMessage(message.trim());
      setMessage('');
      setInterimTranscript('');
      setSelectedImage(null);
      setShowImageInput(false);
    }
  };

  const handleVoiceTranscript = useCallback((transcript: string) => {
    setMessage(prev => {
      const newMessage = prev.trim() ? `${prev.trim()} ${transcript}` : transcript;
      return newMessage;
    });
  }, []);

  const handleInterimTranscript = useCallback((interim: string) => {
    setInterimTranscript(interim);
  }, []);

  const handleImageSelect = useCallback(async (file: File) => {
    try {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setIsAnalyzing(true);
      
      const analysis = await analyzeBPMNImage(file);
      setMessage(analysis.explanation);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to analyze the BPMN image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleClearImage = useCallback(() => {
    setSelectedImage(null);
    setShowImageInput(false);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex flex-col gap-2">
        {showImageInput && (
          <ImageInput
            onImageSelect={handleImageSelect}
            disabled={isLoading || isAnalyzing}
            selectedImage={selectedImage}
            onClearImage={handleClearImage}
          />
        )}
        {interimTranscript && (
          <div className="text-sm text-blue-500 italic px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
            {interimTranscript}...
          </div>
        )}
        <div className="flex items-end gap-2">
          <MessageInput
            value={message}
            onChange={setMessage}
            disabled={isLoading}
            isInterim={!!interimTranscript}
            isAnalyzing={isAnalyzing}
          />
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-1",
                showImageInput
                  ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-500",
                (isLoading || isAnalyzing) && "opacity-50 cursor-not-allowed"
              )}
              disabled={isLoading || isAnalyzing}
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <VoiceInput
              ref={voiceInputRef}
              onTranscriptChange={handleVoiceTranscript}
              onInterimChange={handleInterimTranscript}
              disabled={isLoading || isAnalyzing}
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim() || isAnalyzing}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "bg-blue-500 text-white",
                "hover:bg-blue-600 hover:shadow-md",
                "disabled:bg-blue-300 disabled:cursor-not-allowed disabled:shadow-none",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}