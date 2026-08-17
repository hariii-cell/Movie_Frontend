import React, { useState } from 'react';

export default function ImageUpload({ itemId, onImageUpload }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setPreview(dataUrl);
        onImageUpload(itemId, dataUrl);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return React.createElement(
    'div',
    { className: 'image-upload' },
    preview
      ? React.createElement('img', {
          src: preview,
          alt: 'Preview',
          className: 'image-preview',
        })
      : React.createElement('div', { className: 'image-placeholder' }, 'No Image'),
    React.createElement(
      'label',
      { htmlFor: `image-input-${itemId}`, className: 'image-upload-label' },
      uploading ? 'Uploading...' : 'Upload Image'
    ),
    React.createElement('input', {
      id: `image-input-${itemId}`,
      type: 'file',
      accept: 'image/*',
      onChange: handleFileChange,
      className: 'image-upload-input',
      disabled: uploading,
    })
  );
}
