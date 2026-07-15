import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_BOOK } from '../graphql/queries';

export default function BookDetail({ bookId, onBack }) {
  const { loading, error, data } = useQuery(GET_BOOK, {
    variables: { id: bookId },
    skip: !bookId,
  });

  if (!bookId) return null;
  if (loading)
    return (
      <div className="status">
        ⏳ Loading book details…{' '}
        <span className="hook-tag">useQuery + skip</span>
      </div>
    );
  if (error)
    return <div className="status error">❌ Error: {error.message}</div>;
  if (!data?.book) return <div className="status">Book not found.</div>;

  const { book } = data;

  return (
    <div className="book-detail">
      <button className="btn-secondary back-btn" onClick={onBack}>
        ← Back to list
      </button>

      <div className="detail-card">
        <div className="detail-genre-badge">{book.genre}</div>
        <h2 className="detail-title">{book.title}</h2>
        {book.year && <p className="detail-year">Published {book.year}</p>}

        {book.author && (
          <div className="detail-author">
            <span className="detail-label">Author</span>
            <span className="detail-value">{book.author.name}</span>
          </div>
        )}

        <div className="detail-meta">
          <span className="detail-label">Book ID</span>
          <code className="detail-id">{book.id}</code>
        </div>
      </div>
    </div>
  );
}
