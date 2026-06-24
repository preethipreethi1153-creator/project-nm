import React, { useState, useMemo } from 'react';

function App() {
  // Mock Database Setup
  const [posts, setPosts] = useState([
    { id: 1, title: 'Getting Started with React in 2026', content: 'React component architecture continues to rule the web standard...', status: 'Published' },
    { id: 2, title: 'Drafting: Technical Writing Tips', content: 'Always organize your code blocks and split stylesheets cleanly...', status: 'Draft' },
  ]);

  // Form input processing states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Draft');
  const [editingId, setEditingId] = useState(null);

  // App interactions: Searching and focus display views
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  // Reactive matching filter engine
  const filteredPosts = useMemo(() => {
    return posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  // Create & Update Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert('Please enter text content into all active fields.');

    if (editingId) {
      setPosts(posts.map(post => post.id === editingId ? { ...post, title, content, status } : post));
      setEditingId(null);
    } else {
      const newPost = { id: Date.now(), title, content, status };
      setPosts([newPost, ...posts]);
    }

    // Clear buffer states
    setTitle('');
    setContent('');
    setStatus('Draft');
  };

  // Populate active inputs for editor modifications
  const handleEdit = (post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setStatus(post.status);
    setSelectedPost(null); 
  };

  // Destructive mutation array slice lifecycle mapping
  const handleDelete = (id) => {
    if (window.confirm('Confirm delete event? This action cannot be reverted.')) {
      setPosts(posts.filter(post => post.id !== id));
      if (selectedPost?.id === id) setSelectedPost(null);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>✍️ Content Creator Blog Manager</h1>
        <p>A fast environment to draft, structure, and verify blog content pipelines.</p>
      </header>

      <main className="main-layout">
        {/* Left Interactive Node: Content Streams & Filters */}
        <div>
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Query string match across title or content fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <h3>All Articles ({filteredPosts.length})</h3>
          <div className="post-list">
            {filteredPosts.map(post => (
              <article key={post.id} className="post-card">
                <span className={`badge ${post.status.toLowerCase()}`}>{post.status}</span>
                <h3 style={{ margin: '0 0 10px 0' }}>{post.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  {post.content.length > 120 ? `${post.content.substring(0, 120)}...` : post.content}
                </p>
                <div className="btn-group">
                  <button className="btn-primary" onClick={() => setSelectedPost(post)}>View Full View</button>
                  <button className="btn-warning" onClick={() => handleEdit(post)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(post.id)}>Delete</button>
                </div>
              </article>
            ))}
            {filteredPosts.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No matching active logs found.</p>}
          </div>
        </div>

        {/* Right Dynamic Interface Panel */}
        <div>
          {selectedPost ? (
            <div className="detail-card">
              <button className="btn-secondary" style={{ marginBottom: '20px' }} onClick={() => setSelectedPost(null)}>
                ← Close and Return
              </button>
              <span className={`badge ${selectedPost.status.toLowerCase()}`}>{selectedPost.status}</span>
              <h2>{selectedPost.title}</h2>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#374151' }}>{selectedPost.content}</div>
            </div>
          ) : (
            <div className="form-card">
              <h3>{editingId ? '✏️ Modify Active Entry' : '📝 Scaffold New Article Pipeline'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Entry Header String" />
                </div>
                <div className="form-group">
                  <label>Content Markdown/Text</label>
                  <textarea rows="8" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter editorial content raw body layout parameters..." />
                </div>
                <div className="form-group">
                  <label>Visibility State</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn-success" style={{ flex: 1 }}>
                    {editingId ? 'Commit Update Data' : 'Append to Data Array'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setTitle(''); setContent(''); setStatus('Draft'); }}>
                      Drop Changes
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;