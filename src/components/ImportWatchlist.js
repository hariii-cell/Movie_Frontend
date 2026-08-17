import React, { useState } from 'react';
import FileUpload from './FileUpload.js';

export default function ImportWatchlist({ onImport, setError }) {
  const [importing, setImporting] = useState(false);

  const handleFileSelect = async (file) => {
    setImporting(true);
    setError('');

    try {
      const text = await file.text();
      let data = [];

      if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
        if (!Array.isArray(data)) {
          throw new Error('JSON must be an array of items');
        }
      } else if (file.name.endsWith('.csv')) {
        data = parseCSV(text);
      } else {
        throw new Error('Unsupported file type. Please use JSON or CSV.');
      }

      const validData = data.map((item) => ({
        title: item.title || item[0] || '',
        type: item.type || item[1] || 'MOVIE',
        status: item.status || item[2] || 'UNWATCHED',
        rating: parseInt(item.rating || item[3] || 0, 10),
      })).filter((item) => item.title.trim());

      if (validData.length === 0) {
        throw new Error('No valid items found in file');
      }

      onImport(validData);
    } catch (err) {
      setError(`Import failed: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const parseCSV = (text) => {
    const lines = text.split('\n').filter((line) => line.trim());
    if (lines.length < 2) return [];

    const rows = lines.slice(1).map((line) => {
      const cols = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cols.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      cols.push(current.trim().replace(/^"|"$/g, ''));
      return cols;
    });

    return rows.map((row) => ({
      title: row[0] || '',
      type: row[1] || 'MOVIE',
      status: row[2] || 'UNWATCHED',
      rating: row[3] || 0,
    }));
  };

  return React.createElement(
    'div',
    { className: 'import-section' },
    React.createElement('h3', { className: 'import-title' }, 'Import Watchlist'),
    React.createElement(FileUpload, {
      onFileSelect: handleFileSelect,
      accept: '.json,.csv',
      label: importing ? 'Importing...' : 'Choose JSON or CSV file',
    }),
    React.createElement('p', { className: 'import-hint' }, 'CSV format: Title, Type, Status, Rating')
  );
}
