import React, { useState } from 'react';
import './TodoItem.css';

function TodoItem({ todo, onToggleComplete, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="checkbox-container">
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id, todo.completed)}
          />
          <div className={`checkbox-custom ${todo.completed ? 'checked' : ''}`}>
            {todo.completed && (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </label>
      </div>
      
      <div className="todo-content">
        {isEditing ? (
          <div className="edit-form animate-fade-in">
            <input
              type="text"
              className="edit-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              autoFocus
            />
            <textarea
              className="edit-description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Add a description (optional)..."
              rows="3"
            />
            <div className="edit-actions">
              <button 
                className="save-button"
                onClick={handleSave}
              >
                Save Changes
              </button>
              <button 
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div 
              className={`todo-title ${todo.completed ? 'completed' : ''}`}
              onClick={() => setIsEditing(true)}
            >
              {todo.title}
            </div>
            {todo.description && (
              <div className="todo-description-text">{todo.description}</div>
            )}
            <div className="todo-meta">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(todo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </>
        )}
      </div>

      <div className="todo-actions">
        {!isEditing && (
          <>
            <button
              className="todo-action-button edit"
              onClick={() => setIsEditing(true)}
              title="Edit"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              className="todo-action-button delete"
              onClick={() => onDelete(todo.id)}
              title="Delete"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoItem;

