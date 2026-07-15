import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';

export default function CacheInspector() {
  const client = useApolloClient();

  const [snapshot, setSnapshot] = useState(null);
  const [copied, setCopied] = useState(false);
  const takeSnapshot = () => {
    setSnapshot(client.cache.extract());
  };
  const clearCache = () => {
    client.clearStore();
    setSnapshot(null);
  };

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cache-inspector">
      <h2>
        Cache Inspector
        <span className="hook-tag">useApolloClient</span>
      </h2>
      <p className="hint">
        See exactly what Apollo's <code>InMemoryCache</code> is storing. Go to
        the Books tab first to load data, then come back here.
      </p>

      <div className="cache-controls">
        <button className="btn-primary" onClick={takeSnapshot}>
          Snapshot cache
        </button>
        <button className="btn-danger" onClick={clearCache}>
          Clear store
        </button>
        {snapshot && (
          <button className="btn-secondary" onClick={copyJSON}>
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
        )}
      </div>

      {snapshot ? (
        <div className="cache-output">
          <p className="cache-keys">
            {Object.keys(snapshot).length} entries in cache:{' '}
            {Object.keys(snapshot).map((k) => (
              <code key={k} className="cache-key">
                {k}
              </code>
            ))}
          </p>
          <pre className="cache-json">{JSON.stringify(snapshot, null, 2)}</pre>
        </div>
      ) : (
        <p className="empty">
          Click "Snapshot cache" to see Apollo's normalized cache structure.
        </p>
      )}
    </div>
  );
}
