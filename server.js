cdos.find(t => t.id === parseInt(req.params.id));
  if (todo) res.json(todo);
  else res.status(404).send('Todo not found');
});onst express = require('express');
const path = require('path');
const app = express();
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initial todos data with consistent format
let todos = [
  { id: 1, name: "Sample todo", priority: "high", isFun: "true" }
];
let nextId = 2;

// Get all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Get a specific todo by ID
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (todo) res.json(todo);
  else res.status(404).send('Todo not found');
});

// Add a new todo
app.post('/todos', (req, res) => {
  // Extract data from request
  const { name, priority, isFun } = req.body;
  
  // Basic validation
  if (!name) {
    return res.status(400).json({ error: "Todo name is required" });
  }
  
  // Create new todo with consistent format
  const newTodo = { 
    id: nextId++, 
    name,
    priority: priority || 'low',
    isFun: isFun || 'true'
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Delete a todo by ID
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  
  todos = todos.filter(t => t.id !== id);
  
  // Check if todo was actually deleted
  if (todos.length === initialLength) {
    return res.status(404).json({ message: `Todo with ID ${id} not found` });
  }
  
  // Return success message instead of empty response
  res.json({ message: `Todo with ID ${id} deleted successfully` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
