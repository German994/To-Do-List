// Método para capturar la información de los inputs y guardarlo en el localStorage
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
function displayTasks(newToDoList) {
  const pendingTasks = document.querySelector("#list-task__pending"); // Etiqueta donde se mostraran las 'task' pendientes.
  // Verifica si el elemento no existe en el HTML.
  if (!pendingTasks) {
    console.error("El elemento no existe");
    return;
  }
  // Convierte la tareas en etiquetas HTML.
  const pendingTasksHtml = newToDoList.map((task) => {
    return `
      <span><input class="t__input" type="checkbox" id="t-input" /></span>
      <li>${task.name}</li>
    `;
  });
  pendingTasks.innerHTML = pendingTasksHtml.join(""); // Inserta etiqueta HTML en el elemento '#list-task__pending'.
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
  return "task-" + Date.now().toString(36); // Nombre de la tarea en milisegundos y en base 36
}

// Añade un event listener al documento. Se ejecuta cuando todo el contenido del DOM ha sido cargado.
document.addEventListener("DOMContentLoaded", () => {
  const tasks = getTaskFromMemory(); // Obtiene las tareas almacenadas.
  displayTasks(tasks); // Muestra las tareas.
});