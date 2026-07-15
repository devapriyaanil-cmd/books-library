import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_AUTHORS } from '../graphql/queries';
import { ADD_AUTHOR } from '../graphql/mutations';

export default function AuthorList() {
  const [newName, setNewName] = useState('');
  const [expanded, setExpanded] = useState(null);
  const { loading, error, data } = useQuery(GET_AUTHORS);
  const [addAuthor, { loading: adding }] = useMutation(ADD_AUTHOR, {
    update(cache, { data: { addAuthor } }) {
      const existing = cache.readQuery({ query: GET_AUTHORS });
      if (!existing) return;
      cache.writeQuery({
        query: GET_AUTHORS,
        data: { authors: [...existing.authors, addAuthor] },
      });
    },
    onCompleted: () => setNewName(''),
  });

  if (loading) return <div className="status">⏳ Loading authors…</div>;
  if (error)
    return <div className="status error">❌ Error: {error.message}</div>;

  const handleAdd = () => {
    if (newName.trim()) {
      addAuthor({ variables: { name: newName.trim() } });
    }
  };

  return (
    <div className="author-list">
      <h2>
        Authors ({data.authors.length})
        <span className="hook-tag">useQuery</span>
      </h2>

      <ul className="authors">
        {data.authors.map((author) => (
          <li key={author.id} className="author-card">
            <button
              className="author-name"
              onClick={() =>
                setExpanded(expanded === author.id ? null : author.id)
              }
            >
              {author.name}
              <span className="expand-icon">
                {expanded === author.id ? '▲' : '▼'}
              </span>
            </button>

            {expanded === author.id && (
              <div className="author-detail">
                <p className="author-id">ID: {author.id}</p>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="add-author">
        <h3>
          Add Author
          <span className="hook-tag">useMutation</span>
        </h3>
        <div className="inline-form">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Author name"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button
            className="btn-primary"
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
          >
            {adding ? 'Adding…' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
