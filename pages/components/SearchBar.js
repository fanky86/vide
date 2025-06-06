'use client';

import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) onSearch(query.trim());
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ display: 'flex', marginBottom: '1rem' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Cari video..."
        style={{
          flex: 1,
          padding: '0.5rem',
          borderRadius: '8px 0 0 8px',
          border: 'none',
          fontSize: '1rem',
        }}
        aria-label="Cari video"
      />
      <button
        onClick={handleSearch}
        style={{
          padding: '0.5rem 1rem',
          background: '#4caf50',
          border: 'none',
          borderRadius: '0 8px 8px 0',
          color: 'white',
          fontSize: '1rem',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        Cari
      </button>
    </div>
  );
}
