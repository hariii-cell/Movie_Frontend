import React from 'react';

export default function ExportButton({ items, filename = 'watchlist' }) {
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (items.length === 0) return;

    const headers = ['Title', 'Type', 'Status', 'Rating'];
    const rows = items.map((item) => [
      `"${item.title.replace(/"/g, '""')}"`,
      item.type,
      item.status,
      item.rating || 'N/A',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const dataBlob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return React.createElement(
    'div',
    { className: 'export-buttons' },
    React.createElement(
      'button',
      { type: 'button', className: 'btn-export', onClick: handleExportJSON },
      'Export JSON'
    ),
    React.createElement(
      'button',
      { type: 'button', className: 'btn-export', onClick: handleExportCSV },
      'Export CSV'
    )
  );
}
