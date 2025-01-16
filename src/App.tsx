import React, { useRef } from 'react';
import { BpmnModeler } from './components/BpmnModeler';
import { AIChat } from './components/chat/AIChat';
import BpmnJS from 'bpmn-js/lib/Modeler';
import { importBPMNXML } from './utils/bpmnUtils';

function App() {
  const modelerRef = useRef<BpmnJS | null>(null);

  const handleModelerInit = (modeler: BpmnJS) => {
    modelerRef.current = modeler;
  };

  const handleImportBPMN = async (xml: string) => {
    if (!modelerRef.current) return;

    try {
      await importBPMNXML(modelerRef.current, xml);
    } catch (error) {
      console.error('Error importing BPMN XML:', error);
      alert('Failed to import the BPMN diagram. Please try again.');
    }
  };

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <div className="grid grid-cols-[400px,1fr] h-full">
        <div className="flex flex-col h-full min-h-0 border-r bg-white">
          <div className="flex-1 min-h-0">
            <AIChat onImportBPMN={handleImportBPMN} />
          </div>
        </div>
        <div className="h-full min-h-0">
          <BpmnModeler onModelerInit={handleModelerInit} />
        </div>
      </div>
    </div>
  );
}

export default App;