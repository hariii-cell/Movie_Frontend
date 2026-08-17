import React from 'react';
import StarRating from './StarRating.js';

export default function MediaList({ items, onStatusToggle, onDelete, onRate }) {
  return React.createElement(
    'ul',
    { className: 'media-list' },
    items.length === 0
      ? React.createElement('li', { className: 'empty-state' }, 'No items match this tab or search.')
      : items.map((item) =>
          React.createElement(
            'li',
            { key: item.id, className: 'media-item' },
            React.createElement(
              'div',
              { className: 'media-main' },
              React.createElement(
                'div',
                null,
                React.createElement('p', { className: 'media-title' }, item.title),
                React.createElement('p', { className: 'media-meta' }, item.type === 'MOVIE' ? 'Movie' : 'TV')
              ),
              React.createElement(
                'div',
                { className: 'actions' },
                React.createElement(
                  'button',
                  { type: 'button', className: 'secondary', onClick: () => onStatusToggle(item) },
                  item.status === 'UNWATCHED' ? 'Mark as watched' : 'Move to watchlist'
                ),
                React.createElement(
                  'button',
                  { type: 'button', className: 'danger', onClick: () => onDelete(item.id) },
                  'Remove'
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'rating-block' },
              item.status === 'WATCHED'
                ? React.createElement(
                    React.Fragment,
                    null,
                    React.createElement(StarRating, {
                      value: item.rating || 0,
                      onRate: (value) => onRate(item.id, value),
                    }),
                    React.createElement('span', null, item.rating ? `${item.rating}/5` : 'Click a star to rate')
                  )
                : React.createElement('span', { className: 'unwatched-rating-note' }, 'Watch it first to rate')
            )
          )
        )
  );
}
