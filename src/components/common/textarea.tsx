import React from 'react';

interface ITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; // Optional label for the textarea
}

const Textarea: React.FC<ITextareaProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-sm">{label}</label>}
      <textarea
        className="resize rounded border border-gray-300 p-2"
        style={{
          resize: 'vertical', // Allow vertical resizing only
          maxHeight: '300px', // Set maximum height
          overflowY: 'auto' // Enable vertical scrolling when content exceeds max height
        }}
        {...props} // Spread the rest of the props to the textarea
      />
    </div>
  );
};

export default Textarea;
