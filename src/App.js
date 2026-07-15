import React, { useState } from 'react';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import AddBookForm from './components/AddBookForm';
import BookSearch from './components/BookSearch';
import AuthorList from './components/AuthorList';
import CacheInspector from './components/CacheInspector';
import './App.css';

const TABS = [
  { id: 'books', label: 'Books', hook: 'useQuery' },
  { id: 'add', label: 'Add Book', hook: 'useMutation' },
  { id: 'search', label: 'Search by Genre', hook: 'useLazyQuery' },
  { id: 'authors', label: 'Authors', hook: 'useQuery' },
  { id: 'cache', label: 'Cache Inspector', hook: 'useApolloClient' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('books');
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 Books Library</h1>
        <p className="header-sub">Books are in handy</p>
      </header>

      <nav className="tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedBook(null);
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === 'books' && !selectedBook && (
          <BookList onSelectBook={(id) => setSelectedBook(id)} />
        )}
        {activeTab === 'books' && selectedBook && (
          <BookDetail
            bookId={selectedBook}
            onBack={() => setSelectedBook(null)}
          />
        )}
        {activeTab === 'add' && (
          <AddBookForm onAdded={() => setActiveTab('books')} />
        )}
        {activeTab === 'search' && <BookSearch />}
        {activeTab === 'authors' && <AuthorList />}
        {activeTab === 'cache' && <CacheInspector />}
      </main>

      <footer className="app-footer">
        <p>You can find and handle any books!!!</p>
      </footer>
    </div>
  );
}
