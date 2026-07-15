import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOOKS, GET_AUTHORS } from '../graphql/queries';
import { ADD_BOOK } from '../graphql/mutations';

export default function AddBookForm({ onAdded }) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [message, setMessage] = useState(null);

  const { data: authorsData } = useQuery(GET_AUTHORS);
  const [addBook, { loading }] = useMutation(ADD_BOOK, {
    optimisticResponse: {
      addBook: {
        __typename: 'Book',
        id: 'temp-' + Date.now(),
        title,
        genre,
        year: year ? parseInt(year, 10) : null,
        author: authorsData?.authors.find((a) => a.id === authorId) || null,
      },
    },

    update(cache, { data: { addBook } }) {
      const existing = cache.readQuery({ query: GET_BOOKS });
      if (!existing) return;
      cache.writeQuery({
        query: GET_BOOKS,
        data: { books: [...existing.books, addBook] },
      });
    },
    onCompleted(data) {
      setMessage({ type: 'success', text: `"${data.addBook.title}" added!` });
      setTitle('');
      setGenre('');
      setYear('');
      setAuthorId('');
      setTimeout(() => setMessage(null), 3000);
      onAdded && onAdded();
    },

    onError(err) {
      setMessage({ type: 'error', text: err.message });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !genre.trim() || !authorId) return;

    addBook({
      variables: {
        title: title.trim(),
        genre: genre.trim(),
        year: year ? parseInt(year, 10) : null,
        authorId,
      },
    });
  };

  return (
    <div className="add-form">
      <h2>
        Add a Book
        <span className="hook-tag">useMutation + optimisticResponse</span>
      </h2>

      {message && (
        <div className={`form-message ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Book title"
            required
          />
        </div>

        <div className="form-field">
          <label>Genre *</label>
          <input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g. Fantasy, Sci-Fi, Dystopia"
            required
          />
        </div>

        <div className="form-field">
          <label>Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 1997"
            min="1000"
            max="2099"
          />
        </div>

        <div className="form-field">
          <label>Author *</label>
          <select
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            required
          >
            <option value="">Select an author…</option>
            {authorsData?.authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Adding…' : 'Add Book'}
        </button>
      </form>
    </div>
  );
}
