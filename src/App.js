import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from './api.js';
import AuthForm from './components/AuthForm.js';
import FilterBar from './components/FilterBar.js';
import MediaForm from './components/MediaForm.js';
import MediaList from './components/MediaList.js';
import ProfilePanel from './components/ProfilePanel.js';
import ExportButton from './components/ExportButton.js';
import ImportWatchlist from './components/ImportWatchlist.js';

const tabs = [
  { key: 'UNWATCHED', label: 'To Watch' },
  { key: 'WATCHED', label: 'Watched' },
];

const emptyForm = {
  title: '',
  type: 'MOVIE',
  status: 'UNWATCHED',
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('UNWATCHED');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [error, setError] = useState('');

  const fetchUser = async () => {
    const response = await apiFetch('/api/user/');
    const data = await response.json();
    setUser(data.username);
  };

  const fetchMedia = async () => {
    const response = await apiFetch('/api/media/');
    if (response.ok) {
      const data = await response.json();
      setItems(data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMedia();
    } else {
      setItems([]);
    }
  }, [user]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTab = item.status === activeTab;
      const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesType && matchesSearch;
    });
  }, [activeTab, items, search, typeFilter]);

  const stats = useMemo(() => {
    const watched = items.filter((item) => item.status === 'WATCHED').length;
    const unwatched = items.filter((item) => item.status === 'UNWATCHED').length;
    const avgRating = items.length
      ? (items.reduce((total, item) => total + (Number(item.rating) || 0), 0) / items.length).toFixed(1)
      : '0.0';

    return { watched, unwatched, avgRating, total: items.length };
  }, [items]);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const response = await apiFetch('/api/login/', {
      method: 'POST',
      body: JSON.stringify(authForm),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.detail || 'Authentication failed.');
      return;
    }

    setUser(data.username);
    setAuthForm({ username: '', password: '' });
    setShowAuth(false);
  };

  const handleLogout = async () => {
    await apiFetch('/api/logout/', { method: 'POST' });
    setUser(null);
    setItems([]);
    setActiveTab('UNWATCHED');
    setShowAuth(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) return;

    const response = await apiFetch('/api/media/', {
      method: 'POST',
      body: JSON.stringify({ ...form, rating: 0 }),
    });

    if (response.ok) {
      setForm(emptyForm);
      await fetchMedia();
    }
  };

  const updateItem = async (id, updates) => {
    const response = await apiFetch(`/api/media/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      await fetchMedia();
    }
  };

  const handleStatusToggle = async (item) => {
    const nextStatus = item.status === 'UNWATCHED' ? 'WATCHED' : 'UNWATCHED';
    await updateItem(item.id, {
      status: nextStatus,
      rating: nextStatus === 'WATCHED' ? item.rating || 0 : 0,
    });
  };

  const handleDelete = async (id) => {
    const response = await apiFetch(`/api/media/${id}/`, { method: 'DELETE' });
    if (response.ok) {
      await fetchMedia();
    }
  };

  const handleRate = async (id, value) => {
    await updateItem(id, { rating: value, status: 'WATCHED' });
  };

  const handleImport = async (importedItems) => {
    try {
      for (const item of importedItems) {
        const response = await apiFetch('/api/media/', {
          method: 'POST',
          body: JSON.stringify({
            title: item.title,
            type: item.type || 'MOVIE',
            status: item.status || 'UNWATCHED',
            rating: item.rating || 0,
          }),
        });
        if (!response.ok) {
          throw new Error(`Failed to import: ${item.title}`);
        }
      }
      await fetchMedia();
      setError('');
    } catch (err) {
      setError(`Import error: ${err.message}`);
    }
  };

  const appView = React.createElement(
    'div',
    { className: 'app-shell' },
    React.createElement(
      'div',
      { className: 'app-card' },
      React.createElement(
        'header',
        { className: 'topbar' },
        React.createElement(
          'div',
          { className: 'brand-block' },
          React.createElement('p', { className: 'eyebrow' }, 'Silver & Gold Collection'),
          React.createElement('h1', null, 'Movie / Show Watchlist')
        ),
        React.createElement(
          'nav',
          { className: 'top-nav' },
          React.createElement('button', { type: 'button', className: 'nav-link active' }, 'Watchlist'),
          React.createElement('button', { type: 'button', className: 'nav-link' }, 'Profile'),
          React.createElement('button', { type: 'button', className: 'nav-link' }, 'Library')
        ),
        React.createElement(
          'div',
          { className: 'user-header' },
          user ? React.createElement('span', null, 'Hi, ', user) : React.createElement('span', null, 'Guest'),
          user
            ? React.createElement(
                'button',
                { type: 'button', className: 'logout-btn', onClick: handleLogout },
                'Logout'
              )
            : React.createElement(
                'button',
                { type: 'button', className: 'logout-btn', onClick: () => setShowAuth(true) },
                'Login'
              )
        )
      ),
      React.createElement(ProfilePanel, { user, stats }),
      React.createElement(MediaForm, { form, setForm, onSubmit: handleSubmit }),
      React.createElement(FilterBar, {
        tabs,
        activeTab,
        setActiveTab,
        search,
        setSearch,
        typeFilter,
        setTypeFilter,
      }),
      React.createElement(MediaList, {
        items: filteredItems,
        onStatusToggle: handleStatusToggle,
        onDelete: handleDelete,
        onRate: handleRate,
      }),
      React.createElement(ExportButton, { items }),
      React.createElement(ImportWatchlist, { onImport: handleImport, setError })
    )
  );

  return React.createElement(
    React.Fragment,
    null,
    showAuth && !user
      ? React.createElement(
          'div',
          { className: 'auth-overlay' },
          React.createElement('div', { className: 'auth-dialog' },
            React.createElement(AuthForm, {
              authForm,
              setAuthForm,
              onSubmit: handleAuthSubmit,
              error,
            })
          )
        )
      : null,
    appView
  );
}
