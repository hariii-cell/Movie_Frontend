import React, { useState } from 'react';

const COMMON_FIXES = {
  'the dark knight rises': 'The Dark Knight Rises',
  'the dark knight': 'The Dark Knight',
  'inception': 'Inception',
  'interstellar': 'Interstellar',
  'pulp fiction': 'Pulp Fiction',
  'forrest gump': 'Forrest Gump',
  'the shawshank redemption': 'The Shawshank Redemption',
  'the godfather': 'The Godfather',
  'avatar': 'Avatar',
  'titanic': 'Titanic',
  'breaking bad': 'Breaking Bad',
  'game of thrones': 'Game of Thrones',
  'the office': 'The Office',
  'stranger things': 'Stranger Things',
  'the crown': 'The Crown',
  'narcos': 'Narcos',
  'the mandalorian': 'The Mandalorian',
  'the witcher': 'The Witcher',
  'dune': 'Dune',
  'oppenheimer': 'Oppenheimer',
  'barbie': 'Barbie',
  'killers of the flower moon': 'Killers of the Flower Moon',
};

const TYPO_MAP = {
  'teh ': 'the ',
  'reccomend': 'recommend',
  'occured': 'occurred',
  'recieve': 'receive',
  'ngiht': 'night',
  'kngiht': 'knight',
  'darkknight': 'dark knight',
  'godFather': 'godfather',
};

export default function Autofixer({ value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fixTypos = (text) => {
    let fixed = text;
    for (const [typo, correct] of Object.entries(TYPO_MAP)) {
      fixed = fixed.toLowerCase().replace(typo, correct);
    }
    return fixed;
  };

  const findSuggestions = (text) => {
    if (!text.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const lower = text.toLowerCase();
    const fixes = [];

    // Check for direct matches
    if (COMMON_FIXES[lower]) {
      fixes.push({
        type: 'format',
        original: text,
        fixed: COMMON_FIXES[lower],
        message: 'Fix title format',
      });
    }

    // Check for typos
    const typoFixed = fixTypos(text);
    if (typoFixed !== text.toLowerCase()) {
      fixes.push({
        type: 'typo',
        original: text,
        fixed: typoFixed.charAt(0).toUpperCase() + typoFixed.slice(1),
        message: 'Fix typo',
      });
    }

    // Check for case issues
    const properCase = text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    if (properCase !== text && properCase.toLowerCase() !== lower) {
      fixes.push({
        type: 'case',
        original: text,
        fixed: properCase,
        message: 'Fix capitalization',
      });
    }

    setSuggestions(fixes);
    setShowSuggestions(fixes.length > 0);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    findSuggestions(newValue);
  };

  const handleApplyFix = (fix) => {
    onChange(fix.fixed);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return React.createElement(
    'div',
    { className: 'autofixer' },
    React.createElement('input', {
      type: 'text',
      value: value,
      onChange: handleChange,
      onFocus: handleInputFocus,
      onBlur: handleInputBlur,
      placeholder: 'Add a movie or show...',
      className: 'autofixer-input',
      autoComplete: 'off',
    }),
    showSuggestions && suggestions.length > 0
      ? React.createElement(
          'div',
          { className: 'autofixer-suggestions' },
          suggestions.map((fix, idx) =>
            React.createElement(
              'div',
              { key: idx, className: 'autofixer-item' },
              React.createElement('span', { className: 'fix-message' }, fix.message),
              React.createElement('span', { className: 'fix-text' }, fix.fixed),
              React.createElement(
                'button',
                {
                  type: 'button',
                  className: 'fix-button',
                  onClick: () => handleApplyFix(fix),
                },
                'Apply'
              )
            )
          )
        )
      : null
  );
}
