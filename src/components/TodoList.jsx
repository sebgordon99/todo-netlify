import React from 'react';
import TodoItem from './TodoItem';
import './TodoList.css';

function TodoList({ todos, onToggleComplete, onUpdate, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3>No tasks yet</h3>
        <p>Add your first task above to get started! 🎉</p>
      </div>
    );
  }

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="todo-list">
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-count">{completedCount} / {totalCount}</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      <div className="todos-container">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleComplete={onToggleComplete}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default TodoList;

