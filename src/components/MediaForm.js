import React from 'react';
import Autofixer from './Autofixer.js';

export default function MediaForm({ form, setForm, onSubmit }) {
  return React.createElement(
    'form',
    { className: 'entry-form', onSubmit },
    React.createElement(Autofixer, {
      value: form.title,
      onChange: (title) => setForm({ ...form, title }),
    }),
    React.createElement(
      'select',
      { value: form.type, onChange: (event) => setForm({ ...form, type: event.target.value }) },
      React.createElement('option', { value: 'MOVIE' }, 'Movie'),
      React.createElement('option', { value: 'TV' }, 'TV')
    ),
    React.createElement(
      'select',
      { value: form.status, onChange: (event) => setForm({ ...form, status: event.target.value }) },
      React.createElement('option', { value: 'UNWATCHED' }, 'To Watch'),
      React.createElement('option', { value: 'WATCHED' }, 'Watched')
    ),
    React.createElement('button', { type: 'submit' }, 'Add')
  );
}
