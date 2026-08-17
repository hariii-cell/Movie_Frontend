import React from 'react';

export default function StarRating({ value, onRate }) {
  return React.createElement(
    'div',
    { className: 'star-row', 'aria-label': `Rating: ${value} out of 5` },
    [1, 2, 3, 4, 5].map((star) =>
      React.createElement(
        'button',
        {
          key: star,
          type: 'button',
          className: star <= value ? 'star active' : 'star',
          onClick: () => onRate(star),
          'aria-label': `Rate ${star} out of 5`,
        },
        '★'
      )
    )
  );
}
