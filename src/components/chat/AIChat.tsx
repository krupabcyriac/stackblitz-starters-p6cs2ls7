import React, { useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { getGeneralResponse, generateBPMN } from '../../services/ai';
import { Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isAi: boolean;
  timestamp: Date;
  xml?: string;
  isStreaming?: boolean;
}

interface AIChatProps {
  onImportBPMN?: (xml: string) => void;
}

export function AIChat({ onImportBPMN }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    const userMessageId = Date.now().toString();
    const aiMessageId = (Date.now() + 1).toString();

    // Add user message
    setMessages(prev => [...prev, {
      id: userMessageId,
      text: message,
      isAi: false,
      timestamp: new Date()
    }]);

    // Add initial AI message
    setMessages(prev => [...prev, {
      id: aiMessageId,
      text: '',
      isAi: true,
      timestamp: new Date(),
      isStreaming: true
    }]);

    setIsLoading(true);

    try {
      // Check if the message is asking to create/generate a BPMN diagram
      const isBPMNRequest = /create|generate|make|build|design|draw/i.test(message) && 
                           /bpmn|diagram|process|workflow/i.test(message);

      if (isBPMNRequest) {
        const updateStreamingMessage = (chunk: string) => {
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId
              ? { ...msg, text: msg.text + chunk }
              : msg
          ));
        };

        const { explanation, xml } = await generateBPMN(message, updateStreamingMessage);
        
        // Update the streaming message with final content
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId
            ? { ...msg, text: explanation, xml, isStreaming: false }
            : msg
        ));
      } else {
        const updateStreamingMessage = (chunk: string) => {
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId
              ? { ...msg, text: msg.text + chunk }
              : msg
          ));
        };

        const { explanation } = await getGeneralResponse(message, updateStreamingMessage);
        
        // Update the streaming message with final content
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId
            ? { ...msg, text: explanation, isStreaming: false }
            : msg
        ));
      }
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId
          ? {
              ...msg,
              text: "I apologize, but I'm currently unable to process your request. Please try again.",
              isStreaming: false
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportBPMN = (xml: string) => {
    if (onImportBPMN) {
      onImportBPMN(xml);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg h-full">
      <div className="flex-none p-4 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Eirene</h2>
        </div>
        <p className="text-sm text-blue-100 mt-1">
          Your BPMN Process Modeling Guide
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
            <Sparkles className="w-12 h-12 text-blue-300" />
            <div>
              <p className="font-medium">Greetings! I'm Eirene</p>
              <p className="text-sm mt-1">
                I can help you with BPMN modeling and answer questions about business processes. 
                Ask me anything about BPMN or request me to create a process diagram!
              </p>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isAi={message.isAi}
            timestamp={message.timestamp}
            xml={message.xml}
            onImport={handleImportBPMN}
            isStreaming={message.isStreaming}
          />
        ))}
      </div>

      <div className="flex-none border-t">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}