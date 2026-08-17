import React from 'react';

export default function ProfilePanel({ user, stats }) {
  return React.createElement(
    'div',
    { className: 'profile-panel' },
    React.createElement(
      'div',
      null,
      React.createElement('p', { className: 'profile-label' }, 'Profile'),
      React.createElement('h2', null, user)
    ),
    React.createElement(
      'div',
      { className: 'profile-stats' },
      React.createElement(
        'div',
        null,
        React.createElement('span', null, 'Total'),
        React.createElement('strong', null, stats.total)
      ),
      React.createElement(
        'div',
        null,
        React.createElement('span', null, 'Watched'),
        React.createElement('strong', null, stats.watched)
      ),
      React.createElement(
        'div',
        null,
        React.createElement('span', null, 'To Watch'),
        React.createElement('strong', null, stats.unwatched)
      ),
      React.createElement(
        'div',
        null,
        React.createElement('span', null, 'Avg. Rating'),
        React.createElement('strong', null, `${stats.avgRating}/5`)
      )
    )
  );
}
