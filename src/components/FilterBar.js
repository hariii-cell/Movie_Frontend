import React from 'react';

export default function FilterBar({ tabs, activeTab, setActiveTab, search, setSearch, typeFilter, setTypeFilter }) {
  return React.createElement(
    'div',
    { className: 'toolbar' },
    React.createElement(
      'div',
      { className: 'tab-row' },
      tabs.map((tab) =>
        React.createElement(
          'button',
          {
            key: tab.key,
            type: 'button',
            className: tab.key === activeTab ? 'tab active' : 'tab',
            onClick: () => setActiveTab(tab.key),
          },
          tab.label
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'filter-row' },
      React.createElement('input', {
        type: 'text',
        value: search,
        onChange: (event) => setSearch(event.target.value),
        placeholder: 'Search titles',
      }),
      React.createElement(
        'select',
        { value: typeFilter, onChange: (event) => setTypeFilter(event.target.value) },
        React.createElement('option', { value: 'ALL' }, 'All types'),
        React.createElement('option', { value: 'MOVIE' }, 'Movies'),
        React.createElement('option', { value: 'TV' }, 'TV')
      )
    )
  );
}
