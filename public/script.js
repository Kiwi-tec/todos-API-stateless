// DOM Elements
const displayTodosBtn = document.getElementById('displayTodos');
const submitTodoBtn = document.getElementById('submitTodo');
const deleteTodoBtn = document.getElementById('deleteTodo');
const todoNameInput = document.getElementById('todoName');
const todoPrioritySelect = document.getElementById('todoPriority');
const todoIsFunSelect = document.getElementById('todoIsFun');
const todoIdToDeleteInput = document.getElementById('todoIdToDelete');
const todoDisplayEl = document.getElementById('todoDisplay');

// Display all todos
async function displayTodos() {
  try {
    // Show loading state
    todoDisplayEl.innerHTML = '<p>Loading todos...</p>';
    
    const response = await fetch('/todos');
    
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    
    const todos = await response.json();
    
    if (todos.length === 0) {
      todoDisplayEl.innerHTML = '<p>No todos found. Add some!</p>';
      return;
    }
    
    // Render todos as formatted HTML
    let todosHTML = '';
    
    todos.forEach(todo => {
      // Determine priority class
      const priorityClass = `${todo.priority.toLowerCase()}-priority`;
      
      // Create todo item HTML
      todosHTML += `
        <div class="todo-item ${priorityClass}">
          <div class="todo-details">
            <span class="todo-name">${todo.name}</span>
            <span class="todo-meta">
              Priority: ${todo.priority} | 
              <span class="todo-fun">${todo.isFun === 'true' ? 'Fun' : 'Not Fun'}</span>
            </span>
          </div>
          <span class="todo-id">ID: ${todo.id}</span>
        </div>
      `;
    });
    
    todoDisplayEl.innerHTML = todosHTML;
  } catch (error) {
    todoDisplayEl.innerHTML = `<p>Error: ${error.message}</p>`;
    console.error('Error fetching todos:', error);
  }
}

// Add a new todo
async function addTodo(event) {
  event.preventDefault();
  
  const name = todoNameInput.value.trim();
  
  if (!name) {
    alert('Todo name is required!');
    todoNameInput.focus();
    return;
  }
  
  const priority = todoPrioritySelect.value;
  const isFun = todoIsFunSelect.value;
  
  try {
    const response = await fetch('/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, priority, isFun })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add todo');
    }
    
    const result = await response.json();
    
    // Clear form fields
    todoNameInput.value = '';
    todoPrioritySelect.value = 'low';
    todoIsFunSelect.value = 'true';
    
    // Display success message
    alert(`Todo added: ${result.name} (ID: ${result.id})`);
    
    // Refresh todo list
    displayTodos();
  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error('Error adding todo:', error);
  }
}

// Delete a todo
async function deleteTodo(event) {
  event.preventDefault();
  
  const id = todoIdToDeleteInput.value.trim();
  
  if (!id) {
    alert('Please enter a todo ID to delete');
    todoIdToDeleteInput.focus();
    return;
  }
  
  try {
    const response = await fetch(`/todos/${id}`, { 
      method: 'DELETE' 
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete todo');
    }
    
    // Clear input field
    todoIdToDeleteInput.value = '';
    
    // Show success message
    alert(result.message);
    
    // Refresh todo list
    displayTodos();
  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error('Error deleting todo:', error);
  }
}

// Event listeners
displayTodosBtn.addEventListener('click', displayTodos);
submitTodoBtn.addEventListener('click', addTodo);
deleteTodoBtn.addEventListener('click', deleteTodo);

// Load todos on page load
document.addEventListener('DOMContentLoaded', displayTodos);
