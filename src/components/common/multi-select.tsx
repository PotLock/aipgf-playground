import React, { useState } from 'react';

interface Tool {
  _id: string;
  name: string;
  tool: {
    name: string;
    description: string;
    params: Record<string, { type: string; description: string }>;
    functions: string;
    address: string;
  };
  user_id: string;
  type: string;
}

interface MultiSelectToolsProps {
  tools: Tool[];
  selectedTools: string[];
  onChangeSelectedTools: (selectedTools: string[]) => void;
  isLoading?: boolean;
}

const MultiSelectTools: React.FC<MultiSelectToolsProps> = ({
  tools,
  selectedTools,
  onChangeSelectedTools,
  isLoading
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTool = (toolId: string) => {
    const updatedSelection = selectedTools.includes(toolId)
      ? selectedTools.filter(id => id !== toolId)
      : [...selectedTools, toolId];
    onChangeSelectedTools(updatedSelection);
  };

  const getToolNameById = (toolId: string) => {
    const tool = tools.find(t => t._id === toolId);
    return tool ? tool.name : '';
  };

  return (
    <div className="relative">
      <div
        className="flex min-h-[40px] cursor-pointer items-center justify-between rounded-md border border-gray-600 bg-gray-700 p-2 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {selectedTools.length > 0 ? (
            selectedTools.map(toolId => (
              <span key={toolId} className="rounded bg-gray-600 px-2 py-1 text-sm">
                {getToolNameById(toolId)}
              </span>
            ))
          ) : (
            <span className="text-gray-400">Select tools...</span>
          )}
        </div>
        <svg
          className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-600 bg-gray-700 shadow-lg">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <span className="text-gray-400">Loading tools...</span>
            </div>
          ) : (
            tools.map(tool => (
              <div
                key={tool._id}
                className={`cursor-pointer p-2 hover:bg-gray-600 ${
                  selectedTools.includes(tool._id) ? 'bg-gray-600' : ''
                }`}
                onClick={() => toggleTool(tool._id)}
              >
                <div className="flex flex-col">
                  <span className="text-sm text-white">{tool.name}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectTools;
