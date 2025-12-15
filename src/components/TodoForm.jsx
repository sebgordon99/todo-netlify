import React, { useState } from 'react';
import './TodoForm.css';

function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim() || null);
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-container">
        <div className="form-row">
          <div className="input-wrapper">
            <input
              type="text"
              className="todo-input"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
            />
            <div className="input-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <button 
            type="submit" 
            className="add-button"
            disabled={!title.trim()}
          >
            <span className="add-button-text-desktop">Add Task</span>
            <span className="add-button-text-mobile">Add</span>
          </button>
        </div>
        {isExpanded && (
          <div className="animate-fade-in">
            <textarea
              className="todo-description"
              placeholder="Add a description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>
        )}
      </div>
    </form>
  );
}

export default TodoForm;

