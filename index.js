function generateUniqueId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const DATABASE_NAME = "task-db";
const taskInput = document.querySelector("#todo-input");

// ADD AND SAVE TASK TO LS
const addTask = () => {
  if (!taskInput.value) {
    const alertMessage = document.querySelector("#alert-message");
    alertMessage.classList.remove("hidden");
    alertMessage.innerHTML = "Task cannot be empty, please add!";

    setTimeout(() => {
      alertMessage.classList.add("hidden");
    }, 5000);
    return;
  }
  const task = {
    id: generateUniqueId(),
    title: taskInput.value,
    created_on: Date.now(),
  };
  const currentTasks = JSON.parse(localStorage.getItem(DATABASE_NAME)) || [];
  localStorage.setItem(DATABASE_NAME, JSON.stringify([...currentTasks, task]));
  taskInput.value = "";
  displayTasks();
};

// FETCH AND DISPLAY TASKS
const displayTasks = () => {
  const taskList = JSON.parse(localStorage.getItem(DATABASE_NAME)) || [];
  const taskContainer = document.querySelector("#taskContainer");
  const isEmpty = taskList.length === 0 || null;

  if (isEmpty) {
    taskContainer.innerHTML = `<p class='text-center text-slate-300'>No tasks to display. Start your task list now!</p>`;
    return;
  }

  const tasks = taskList.sort((a, b) => {
    if (a.created_on > b.created_on) return -1;
    if (a.created_on < b.created_on) return 1;
    return 0;
  });

  const taskItems = tasks.map((task) => [
    ` <div class="group flex items-center justify-between p-4 mb-4 rounded-md w-full h-16 bg-gray-50 hover:bg-gray-200  shadow-md">
            <a href="">${task.title}</a>
            <section class="flex hidden gap-6 group-hover:block  pl-8">
                <button onclick="editTask('${task.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />   
                </svg>
                </button>
                  
                <button class='pl-4' onclick="removeTask('${task.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
                </button>    
            </section>
          </div> 
        `,
  ]);

  taskContainer.innerHTML = taskItems.join("");
};

// REMOVE TASK
const removeTask = (id) => {
  const taskDatabase = JSON.parse(localStorage.getItem(DATABASE_NAME)) || [];
  Swal.fire({
    title: "Confirm Task Deletion",
    text: "Please be aware that this action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Delete Task",
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedDatabase = taskDatabase.filter((task) => task.id !== id);
      localStorage.setItem(DATABASE_NAME, JSON.stringify(updatedDatabase));
      displayTasks();
      Swal.fire(
        "Task Removed!",
        "The task has been successfully removed!",
        "Deletion Successful!"
      );
    }
  });
};

// EDIT TASK
const editTask = (id) => {
  console.log(id);
  const taskDatabase = JSON.parse(localStorage.getItem(DATABASE_NAME)) || [];
  const taskToEdit = taskDatabase.find((task) => task.id === id);
  taskInput.value = taskToEdit.title;
  taskInput.focus();
  const addTaskButton = document.querySelector("#add-todo-Btn");
  addTaskButton.classList.add("hidden");
  const updateTaskButton = document.querySelector("#update-task-Btn");
  updateTaskButton.classList.remove("hidden");
  updateTaskButton.setAttribute("task_id_to_update", id);
};

// UPDATE TASK
const updateTask = (id) => {
  if (!taskInput.value) {
    const alertMessage = document.querySelector("#alert-message");
    alertMessage.classList.remove("hidden");
    alertMessage.innerHTML =
      "Please enter a title. This field cannot be empty.";

    setTimeout(() => {
      alertMessage.classList.add("hidden");
    }, 5000);
    return;
  }

  const updateTaskButton = document.querySelector("#update-task-Btn");
  const task_id_to_update = updateTaskButton.getAttribute("task_id_to_update");
  const tasksToUpdate = JSON.parse(localStorage.getItem(DATABASE_NAME)) || [];
  const updatedTasks = tasksToUpdate.map((task) => {
    if (task.id === task_id_to_update) {
      return { ...task, title: taskInput.value };
    } else {
      return task;
    }
  });

  Swal.fire(
    "Task Updated!",
    "The task has been successfully updated!",
    "Update Successful!"
  );

  localStorage.setItem(DATABASE_NAME, JSON.stringify(updatedTasks));
  displayTasks();
  taskInput.value = "";
  const addTaskButton = document.querySelector("#add-todo-Btn");
  addTaskButton.classList.remove("hidden");
  updateTaskButton.classList.add("hidden");
};
displayTasks();
