import React, { useEffect, useRef } from 'react';
import BpmnJS from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import { importBPMNXML, initializeBpmnDiagram } from '../utils/bpmnUtils';
import { exportDiagram, type ExportFormat } from '../utils/exportUtils';
import { TopBar } from './TopBar';

interface BpmnModelerProps {
  onModelerInit?: (modeler: BpmnJS) => void;
}

export function BpmnModeler({ onModelerInit }: BpmnModelerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnJS | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const modeler = new BpmnJS({
      container: containerRef.current,
      keyboard: {
        bindTo: document
      }
    });

    modelerRef.current = modeler;
    
    if (onModelerInit) {
      onModelerInit(modeler);
    }

    initializeBpmnDiagram(modeler).catch((error) => {
      console.error('Failed to initialize BPMN diagram:', error);
    });

    return () => {
      modeler.destroy();
    };
  }, [onModelerInit]);

  const handleImport = async (xml: string) => {
    if (!modelerRef.current) return;

    try {
      await importBPMNXML(modelerRef.current, xml);
    } catch (error) {
      console.error('Error importing BPMN diagram:', error);
      alert('Failed to import the diagram. Please check if the file is valid.');
    }
  };

  const handleExport = async (format: ExportFormat) => {
    if (!modelerRef.current) return;

    try {
      await exportDiagram(modelerRef.current, { format });
    } catch (error) {
      console.error('Error exporting diagram:', error);
      alert(`Failed to export the diagram as ${format.toUpperCase()}. Please try again.`);
    }
  };

  const handleClear = async () => {
    if (!modelerRef.current) return;

    try {
      await initializeBpmnDiagram(modelerRef.current);
    } catch (error) {
      console.error('Error clearing canvas:', error);
      alert('Failed to clear the canvas. Please try again.');
    }
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const tool = event.dataTransfer.getData('tool');
    
    if (modelerRef.current && tool) {
      const elementFactory = modelerRef.current.get('elementFactory');
      const create = modelerRef.current.get('create');
      
      const shape = elementFactory.createShape({ type: `bpmn:${tool}` });
      
      create.start(event, shape);
    }
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar 
        onImport={handleImport}
        onExport={handleExport}
        onClear={handleClear}
      />
      <div 
        ref={containerRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="flex-1 bg-white min-h-0"
      />
    </div>
  );
}