import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_BOOKS_BY_GENRE } from '../graphql/queries';

const GENRES = ['Fantasy', 'Sci-Fi', 'Dystopia', 'Satire'];

export default function BookSearch() {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchByGenre, { loading, error, data, called }] = useLazyQuery(
    GET_BOOKS_BY_GENRE,
    { fetchPolicy: 'network-only' }
  );

  const handleSearch = () => {
    if (!selectedGenre) return;
    searchByGenre({ variables: { genre: selectedGenre } });
  };

  return (
    <div className="book-search">
      <h2>
        Search by Genre
        <span className="hook-tag">useLazyQuery</span>
      </h2>
      <p className="hint">
        The query only fires when you click Search — that is{' '}
        <code>useLazyQuery</code> in action.
      </p>

      <div className="search-row">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">Pick a genre…</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <button
          className="btn-primary"
          onClick={handleSearch}
          disabled={loading || !selectedGenre}
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      {error && <div className="status error">❌ Error: {error.message}</div>}
      {called && !loading && data && (
        <div className="search-results">
          <p className="results-count">
            {data.booksByGenre.length} book
            {data.booksByGenre.length !== 1 ? 's' : ''} in {selectedGenre}
          </p>

          {data.booksByGenre.length === 0 ? (
            <p className="empty">No books found in this genre.</p>
          ) : (
            <ul className="books">
              {data.booksByGenre.map((book) => (
                <li key={book.id} className="book-card">
                  <div className="book-info">
                    <span className="book-title">{book.title}</span>
                    <span className="book-meta">
                      {book.author?.name}
                      {book.year ? ` · ${book.year}` : ''}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
