const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let todos = [
  { id: 1, name: "Sample todo", priority: "high", isComplete: false, isFun: true }
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
  const newTodo = { id: nextId++, ...req.body };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Delete a todo by ID
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
