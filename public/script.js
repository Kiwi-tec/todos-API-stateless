document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.getElementById("todoForm");
    const todoList = document.getElementById("todoList");
  
    function loadTodos() {
      fetch("/todos")
        .then(res => res.json())
        .then(data => {
          todoList.innerHTML = '';
          data.forEach(todo => {
            const li = document.createElement("li");
            li.textContent = `${todo.name} [${todo.priority}] - Fun: ${todo.isFun} - Complete: ${todo.isComplete}`;
            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.style.marginLeft = "10px";
            delBtn.style.backgroundColor = "red";
            delBtn.style.color = "white";
            delBtn.onclick = () => deleteTodo(todo.id);
            li.appendChild(delBtn);
            todoList.appendChild(li);
          });
        });
    }
  
    function deleteTodo(id) {
      fetch(`/todos/${id}`, { method: 'DELETE' })
        .then(() => loadTodos());
    }
  
    todoForm.onsubmit = (e) => {
      e.preventDefault();
      const newTodo = {
        name: document.getElementById("name").value,
        priority: document.getElementById("priority").value,
        isComplete: false,
        isFun: document.getElementById("isFun").checked
      };
  
      fetch("/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo)
      }).then(() => {
        todoForm.reset();
        loadTodos();
      });
    };
  
    loadTodos();
  });