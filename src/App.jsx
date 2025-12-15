import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import './App.css';

const API_BASE = '/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_BASE);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title, description) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
    } catch (err) {
      setError(err.message);
      console.error('Error creating todo:', err);
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
    } catch (err) {
      setError(err.message);
      console.error('Error updating todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting todo:', err);
    }
  };

  const toggleComplete = async (id, completed) => {
    await updateTodo(id, { completed: !completed });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-icon">✓</div>
        <h1>Todo List</h1>
        <p>Stay organized and get things done</p>
      </header>

      <main className="app-main">
        <TodoForm onAdd={addTodo} />
        
        {error && (
          <div className="error-message animate-fade-in">
            <div className="error-message-content">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p>{error}</p>
            </div>
            <button onClick={fetchTodos}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner animate-spin"></div>
            <p className="loading-text">Loading todos...</p>
          </div>
        ) : (
          <TodoList
            todos={todos}
            onToggleComplete={toggleComplete}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
          />
        )}
      </main>
    </div>
  );
}

export default App;

