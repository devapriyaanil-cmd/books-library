import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOOKS } from '../graphql/queries';
import { DELETE_BOOK } from '../graphql/mutations';

export default function BookList({ onSelectBook }) {
  const [filter, setFilter] = useState('');
  const { loading, error, data, refetch } = useQuery(GET_BOOKS);
  const [deleteBook] = useMutation(DELETE_BOOK, {
    update(cache, { data: { deleteBook } }) {
      const existing = cache.readQuery({ query: GET_BOOKS });
      if (!existing) return;

      cache.writeQuery({
        query: GET_BOOKS,
        data: {
          books: existing.books.filter((b) => b.id !== deleteBook.id),
        },
      });
    },
  });

  if (loading)
    return (
      <div className="status">
        ⏳ Loading books… <span className="hook-tag">useQuery</span>
      </div>
    );
  if (error)
    return <div className="status error">❌ Error: {error.message}</div>;

  const filtered = filter
    ? data.books.filter(
        (b) =>
          b.title.toLowerCase().includes(filter.toLowerCase()) ||
          b.author?.name.toLowerCase().includes(filter.toLowerCase())
      )
    : data.books;

  return (
    <div className="book-list">
      <div className="list-header">
        <h2>
          All Books ({filtered.length})
          <span className="hook-tag">useQuery</span>
        </h2>
        <div className="list-controls">
          <input
            className="search-input"
            placeholder="Search title or author…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button className="btn-secondary" onClick={() => refetch()}>
            Refresh
          </button>
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="empty">No books match your search.</p>
      )}

      <ul className="books">
        {filtered.map((book) => (
          <li key={book.id} className="book-card">
            <div
              className="book-info"
              onClick={() => onSelectBook && onSelectBook(book.id)}
            >
              <span className="book-title">{book.title}</span>
              <span className="book-meta">
                {book.author?.name} · {book.genre}
                {book.year ? ` · ${book.year}` : ''}
              </span>
            </div>
            <button
              className="btn-danger"
              onClick={() => {
                if (window.confirm(`Delete "${book.title}"?`)) {
                  deleteBook({ variables: { id: book.id } });
                }
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
