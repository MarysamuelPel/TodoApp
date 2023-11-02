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
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
</svg>

                </button>
                  
                <button class='pl-4' onclick="removeTask('${task.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
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
