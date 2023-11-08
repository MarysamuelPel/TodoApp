const todoInput = document.getElementById("todo-input")
const todoDBKey = "todoList"


const getTemplateElement = (inputValue, id) => {
    return (`
        <section class="group">
            <div class="group mb-3 flex flex-row justify-between px-2 py-2 group-hover:bg-gray-200 rounded-lg">
                <!-- Todo input value -->
                <button class="text-lg font-medium" onclick="handlePreviewTodo('${id}')">${inputValue}</button>
                <!-- edit icon -->
                <div class="invisible group-hover:visible">
                    <button class="mr-[1rem]" onclick="handleEditMode('${id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg> 
                    </button>
                    <!-- Delete icon -->
                    <button onclick="deleteTodo('${id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </button>
                </div>
            </div>
        </section>`);
}



// Display todo
const displayNewTodo = (parentAttribute, getTemplateElement) => {
    // Retrieve item from database
    const todoDatabase = getTodo(todoDBKey)
    // sort todo
    todoDatabase?.sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0
    );
    // Get the parent element
    const parentElement = document.querySelector(`${parentAttribute}`)
    // if(todoDatabase.lenght ===0){
    //     parentElement.innerHTML = <p>Enter your todos here</p>
    //     return;
    // }
    parentElement.innerHTML = ""
    todoDatabase.forEach((todo) => {
        // Grab the parent
        parentElement.innerHTML += getTemplateElement(todo.todoName, todo.id)
    })
}

displayNewTodo("#todos", getTemplateElement)

// Create a todo
const createTodo = (event) => {
    event.preventDefault()
    // Grab the input field
    const todoValue = todoInput.value
    // const todoInput = document.getElementById("todo-input")
    const formMessageSpan = document.querySelector("#form-message");

    if (!todoValue) {
        formMessageSpan.classList.remove("hidden");
        setTimeout(() => {
            formMessageSpan.classList.add("hidden");
        }, 1000);
        return;
    }

    const todoDatabase = getTodo(todoDBKey)
    // New todo the user creates
    const newTodo = {
        todoName: todoValue,
        id: uuid(),
        createdAt: Date.now(),
    }
    // Store new todo in the database.
    todoDatabase?.push(newTodo)

    // Store back in the localstorage
    saveTodo(todoDBKey, todoDatabase);
    // console.log(todoDatabase, "here");
    displayNewTodo("#todos", getTemplateElement)
    // resetting form value
    todoInput.value = "";
}


const handleEditMode = (todoId) => {
    const todoDatabase = getTodo(todoDBKey);
    // getting exact todo to edit
    const todoToUpdate = todoDatabase.find((todo) => todo.id === todoId);
    if (!todoToUpdate) {
        return;
    }
    // Set the value and ID for the update input and button
    todoInput.value = todoToUpdate.todoName;
    const updateTodoButton = document.getElementById("update-todo-btn")
    const addTodoButton = document.getElementById("add-todo-btn")
    addTodoButton.classList.add("hidden")
    updateTodoButton.classList.remove("hidden")
    updateTodoButton.setAttribute("todo-id-to-update", todoId)
}


// UPDATE TODO FUNCTION
const updateTodo = () => {
    const todoValue = todoInput.value;
    if (!todoValue) {
        const errorText = document.getElementById("form-message");
        errorText.innerHTML = "Please enter a valid todo.";
        errorText.classList.remove("hidden");
        setTimeout(() => {
            errorText.classList.add("hidden");
        }, 3000);
        return;
    }

    const updateTodoButton = document.getElementById("update-todo-btn");
    const addTodoButton = document.getElementById('add-todo-btn');
    const todoId = updateTodoButton.getAttribute("todo-id-to-update");
    const todoDatabase = getTodo(todoDBKey);
    // Find the todo's index
    const todoIndex = todoDatabase.findIndex((todo) => todo.id === todoId);

    if (todoIndex !== -1) {
        // Update the todo with the edited task
        todoDatabase[todoIndex].todoName = todoValue;

        // Store in local storage
        saveTodo(todoDBKey,todoDatabase);

        addTodoButton.classList.remove("hidden");
        updateTodoButton.classList.add("hidden");
        todoInput.value = "";
        console.log("before update to UI");
        // Update the displayed todos
        displayNewTodo("#todos", getTemplateElement);
    }
}



// DELETE TODO FUNCTION
const deleteTodo = (todoId) => {
    Swal.fire({
        title: 'Delete Todo',
        text: 'Are you sure you want to delete item?',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
    }).then((res) => {
        if (res.isConfirmed) {
            // Read the local storage
            const todoDatabase = getTodo(todoDBKey)
            // Find the todos index
            const todoIndex = todoDatabase.findIndex(todo => todo.id === todoId)
            if (todoIndex !== -1) {
                // Remove the todo at the specified index
                todoDatabase.splice(todoIndex, 1)
                // Store in local storage
                saveTodo(todoDBKey, todoDatabase)
                displayNewTodo("#todos", getTemplateElement)
            }
        }
    });
};