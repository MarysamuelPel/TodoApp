const todoDBKey = "todoList"

const renderCurrentPreviewTodo = () => {
  const currentTodoId = getTodo("presentTodo");
  // Get the database
  const todoDatabase = getTodo(todoDBKey);
  // Get the current todo using the current todoId
  const currentTodo = todoDatabase.find(todo => todo.id === currentTodoId)
  const { id, todoName, createdAt, todoDescription } = currentTodo
  const todoDate = new Date(createdAt).toDateString();
  const previewTodoContainer = document.getElementById("preview-todo-container")
  previewTodoContainer.innerHTML = `
    <section class="mb-3">
            <div class="mb-3 flex flex-row justify-between py-2 rounded-lg">
              <!--Preview Todo Area -->
              <button class="text-lg font-medium" id="todo-preview-name">${todoName}</button>
              <!-- edit icon -->
              <div class="">
                <button class="mr-[1rem]" onclick="handleEditPreviewMode('${id}')">
                  <svg xmlns="http://www.w3.org/2000/svg"
                   fill="none" 
                   viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                     class="w-6 h-6">
                    <path stroke-linecap="round" 
                    stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <!-- Delete icon -->
                <button onclick="deleteTodo('${id}')">
                  <svg xmlns="http://www.w3.org/2000/svg"
                   fill="none" 
                   viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor" 
                    class="w-6 h-6">
                    <path stroke-linecap="round" 
                    stroke-linejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </button>
              </div>
            </div>
            <p class="border border-gray-200 border-r-0 border-l-0 px-2 
            py-2" id="todo-preview-desc">${todoDescription || `<span class="text-gray-400
             italic"> Your description appears here</span>`}</p>
          </section>

          <!-- Preview Todo Date and state -->
          <section class="">
            <span class="mr-2 text-xs">${todoDate}</span>
            <span class="mr-2">&middot;</span>
            <span class="bg-slate-300 rounded-full px-2 py-0.3 text-sm">pending</span>
          </section>
          <!-- View all todos -->
          <section class="flex flex-row items-center justify-center mt-8
           hover:text-blue-500">
            <a href="./index.html" class="flex flex-row justify-center">
                <button class="">
                <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                 viewBox="0 0 24 24" 
                 stroke-width="1.5"
                  stroke="currentColor"
                   class="w-3 h-3">
       
                 <path stroke-linecap="round"
                  stroke-linejoin="round"
                   d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
               </svg>
                </button>
                <span class="text-sm ml-2 hover:text-blue-500">View all todos</span>
            </a>
            </section>
    `
}

renderCurrentPreviewTodo()

const handleEditPreviewMode = (todoId) => {
  const todoPreviewName = document.getElementById("todo-preview-name").textContent
  const todoPreviewDesc = document.getElementById("todo-preview-desc").textContent

  Swal.fire({
    title: "Edit Preview",
    html: `
    <div class="flex flex-col gap-6">
      <input value="${todoPreviewName}" class="p-2 rounded-lg border
       border-slate-500 focus:border-yellow-500 focus:outline-none" 
       id="todo-input"/>
      <textarea name="" id="todo-description" cols="20" rows="5" 
      class="border border-slate-500 focus:border-yellow-500 
      focus:outline-none p-2 rounded-lg">${todoPreviewDesc}</textarea>
    </div>
    `,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: 'Update',
    preConfirm: () => {
      
      const todoInput = document.getElementById("todo-input").value;
      const todoDesc = document.getElementById("todo-description").value;
      // Check if the fields are empty
      if (!todoInput.trim() || !todoDesc.trim()) {
        // Get the values from the input fields
        Swal.showValidationMessage("Fields cannot be empty");
        return false; // Prevent the modal from closing
      }
      return {
        todoInput: document.getElementById("todo-input").value,
        todoDesc: document.getElementById("todo-description").value
      }
    }
  }).then(res => {
    if (res.isConfirmed) {
      const todoDatabase = getTodo(todoDBKey);
      // Find the todo's index
      const todoIndex = todoDatabase.findIndex((todo) => todo.id === todoId);
      if (todoIndex !== -1) {
        // Update the todo with the edited task
        todoDatabase[todoIndex].todoName = res.value.todoInput;
        todoDatabase[todoIndex].todoDescription = res.value.todoDesc;
        // Store in local storage
        saveTodo(todoDBKey, todoDatabase);
        renderCurrentPreviewTodo()
      }
    }
  })
}

// Delete a todo
const deleteTodo = (todoId) => {
  Swal.fire({
    title: 'Delete Todo',
    text: 'Do you want to delete this todo?',
    icon: 'warning',
    confirmButtonText: 'Yes',
    showCancelButton: true
  }).then((res) => {
    if (res.isConfirmed) {
      // Read the local storage
      const todoDatabase = getTodo(todoDBKey)
      // Delete the actual todo
      const newTodoDatabase = todoDatabase.filter((todo) => todo.id !== todoId)
      // Store in local storage
      saveTodo(todoDBKey, newTodoDatabase)
      // Redirect to home page
      location.href = "./index.html"
    }
  })

}



