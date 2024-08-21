function saveTask(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const task = {};
  formData.forEach((value, key) => (task[key] = value));

  const tasks = getTaskFromMemory();
  const newToDoList = [...tasks, task];
  saveTaskForMemory(newToDoList);

  form.reset();

  displayTasks(newToDoList);
}

function displayTasks(newToDoList) {
  const listTasksElement = document.querySelector("#list-task");

  if (!listTasksElement) {
    console.error("El elemento list-task no existe");
    return;
  }
  const listTasksHtml = newToDoList.map((task) => {
    return `
      <ul id="task">
        <li>${task.name}</li>
        <li><input class="t__input" type="checkbox" id="t-input" name="status" /></li>
      </ul>
      `;
  });
  listTasksElement.innerHTML = listTasksHtml.join("");
}

function getTaskFromMemory() {
  const toDoListFromMemory = localStorage.getItem("toDoList");

  if (!toDoListFromMemory) {
    saveTaskForMemory([]);
    return [];
  }
  return JSON.parse(toDoListFromMemory);
}

function saveTaskForMemory(tasks) {
  localStorage.setItem("toDoList", JSON.stringify(tasks));
}