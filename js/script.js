// Capturar la información de los inputs y guardarlo en el localStorage
function saveTask(event) {
  event.preventDefault(); // Evita la redirection.
  const form = event.target; // Captura el elemento 'form'.
  const formData = new FormData(form); // Captura los datos del formulario en un 'formData'.
  const task = {}; // Crea el objeto 'task'.
  formData.forEach((value, key) => (task[key] = value)); // Asigna cada par clave-valor del formulario como propiedades del objeto 'task'.
  task.id = generateUniqueId(); // Genera un id único para cada 'task'.
  task.completed = false; // Establecer la propiedad 'completed' de 'task' en 'false' (marca la tarea como NO completada).
  const tasks = getTaskFromMemory(); // Obtiene la tareas del localStorage
  const newToDoList = [...tasks, task]; // Se crea un nuevo array con los elementos de 'tasks' y se añade el objeto 'task' al final.
  saveTaskForMemory(newToDoList); // Guarda la nueva lista de tareas 'newToDoList' en el localStorage.
  form.reset(); // Reiniciar el formulario.
  displayTasks(newToDoList); // Inyecta las tareas en el HTML.
}

// Muestra la lista actualizada de tareas en el HTML.
function displayTasks(tasks) {
  const pendingTasksElement = document.querySelector("#list-task__pending"); // Etiqueta donde se mostraran las 'task' pendientes.
  const completedTasksElement = document.querySelector("#list-task__completed"); // Etiqueta donde se mostraran las 'task' completadas.
  // Verifica si los elemento no existe en el HTML.
  if (!pendingTasksElement && !completedTasksElement) {
    console.error(
      "Los elementos pending-tasks-list o completed-tasks-list no existen"
    );
    return;
  }
  // Convierte la tareas en etiquetas HTML.
  const pendingTasksHtml = tasks
    .filter((task) => !task.completed)
    .map((task) => {
      return `
      <li class="task__pending">
        <input type="checkbox" id="task-checkbox__${task.id}" />
        <span id="task-name__${task.id}" >${task.name}</span>
        <button onclick="deleteTask('${task.id}')">X</button>
      </li>
    `;
    });
  const completedTasksHtml = tasks
    .filter((task) => task.completed)
    .map((task) => {
      return `
      <li class="task__completed">
        <input type="checkbox" id="task-checkbox__${task.id}" checked />
        <span id="task-name__${task.id}" >${task.name}</span>
        <button onclick="deleteTask('${task.id}')">X</button>
      </li>
    `;
    });
  pendingTasksElement.innerHTML = pendingTasksHtml.join(""); // Inserta etiqueta HTML en el elemento '#list-task__pending'.
  completedTasksElement.innerHTML = completedTasksHtml.join(""); // Inserta etiqueta HTML en el elemento '#list-task__completed'.
  changeTasksState(tasks);
}

// Obtiene desde localStorage la información de las tareas almacenadas.
function getTaskFromMemory() {
  const toDoListFromMemory = localStorage.getItem("toDoList"); // Recupera la cadena de texto almacenada en localStorage bajo la clave "toDoList".
  // Si toDoListFromMemory es un valor falsy, se guarda una lista vacía  y retorna un array vacío.
  if (!toDoListFromMemory) {
    saveTaskForMemory([]);
    return [];
  }
  return JSON.parse(toDoListFromMemory); // Convierte 'toDoListFromMemory' a objeto.
}

function saveTaskForMemory(tasks) {
  localStorage.setItem("toDoList", JSON.stringify(tasks)); // Convierte el array en una cadena JSON y lo guarda en el 'localStorage'.
}

// Genera una id única
function generateUniqueId() {
  return "task-" + Date.now().toString(36); // Nombre de la tarea en mili-segundos y en base 36
}

// Elimina una tarea del localStorage
function deleteTask(idTask) {
  const tasks = getTaskFromMemory();
  const tasksFiltered = tasks.filter((task) => task.id !== idTask); // Guarda en 'tasksFiltered' la tarea a eliminar
  saveTaskForMemory(tasksFiltered);
  displayTasks(tasksFiltered);
}

// Asigna el evento al checkbox para la actualización y visualización de las tareas.
function changeTasksState(tasks) {
  tasks.forEach((task) => {
    const checkbox = document.querySelector(`#task-checkbox__${task.id}`);
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked; // Actualizar el estado de 'completed' de la tarea en función del estado del checkbox
      saveTaskForMemory(tasks);
      displayTasks(tasks);
    });
  });
}

// Añade un event listener al documento. Se ejecuta cuando todo el contenido del DOM ha sido cargado.
document.addEventListener("DOMContentLoaded", () => {
  const tasks = getTaskFromMemory(); // Obtiene las tareas almacenadas.
  displayTasks(tasks); // Muestra las tareas.
});