import React from 'react';

export default function FileUpload({ onFileSelect, accept = '*', label = 'Upload File' }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return React.createElement(
    'div',
    { className: 'file-upload' },
    React.createElement(
      'label',
      { htmlFor: 'file-input', className: 'file-upload-label' },
      label
    ),
    React.createElement('input', {
      id: 'file-input',
      type: 'file',
      accept: accept,
      onChange: handleFileChange,
      className: 'file-upload-input',
    })
  );
}
