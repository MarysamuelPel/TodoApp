// Utility function
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

// READ  TODO FUNCTION: Retrieve todos from database
const getTodo = (todoDB) =>{
  return JSON.parse(localStorage.getItem(todoDB)) || [];
}


//Store todos in the database
const saveTodo = (todoKey,todoDatabase) =>{
  localStorage.setItem(todoKey,JSON.stringify(todoDatabase))
}
const handlePreviewTodo = (todoId) =>{
  saveTodo("presentTodo", todoId)
  location.href = "./previewtodo.html"
  
}

