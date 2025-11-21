let items = [];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
const template = document.getElementById("to-do__item-template");

function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  return savedTasks ? JSON.parse(savedTasks) : items;
}

function createItem(item) {
  const clone = template.content.querySelector(".to-do__item").cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  textElement.textContent = item;

  // Обработчик удаления задачи
  deleteButton.addEventListener('click', () => {
    clone.remove();
    items = getTasksFromDOM();
    saveTasks(items);
  });

  // Обработчик копирования задачи
  duplicateButton.addEventListener('click', () => {
    const newItem = createItem(item);
    listElement.prepend(newItem);
    items = getTasksFromDOM();
    saveTasks(items);
  });

  // Обработчик редактирования задачи
  editButton.addEventListener('click', () => {
    textElement.setAttribute('contenteditable', 'true');
    textElement.focus();
  });

  // Сохранение при снятии фокуса с редактируемого элемента
  textElement.addEventListener('blur', () => {
    textElement.setAttribute('contenteditable', 'false');
    items = getTasksFromDOM();
    saveTasks(items);
  });

  return clone;
}

function getTasksFromDOM() {
  const itemsNamesElements = document.querySelectorAll('.to-do__item-text');
  const tasks = [];
  itemsNamesElements.forEach(element => {
    tasks.push(element.textContent);
  });
  return tasks;
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Инициализация приложения
items = loadTasks();

// Отрисовка начальных задач
items.forEach(item => {
  const newItem = createItem(item);
  listElement.append(newItem);
});

// Обработчик отправки формы
formElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const taskText = inputElement.value;
  
  if (taskText) {
    const newItem = createItem(taskText);
    listElement.prepend(newItem);
    items = getTasksFromDOM();
    saveTasks(items);
    inputElement.value = '';
  }
});