let tasks = [];

const displayTasks = () => {
  const tasksList = document.getElementById("tasks");
  tasksList.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.draggable = true;

    if (task.completed) {
      taskElement.classList.add("completed");
    }

    taskElement.innerHTML = `
            <span>${task.text}---> Due: ${task.dueDate}</span>
            <button onclick="deleteTask(${index})">Delete</button>
          `;

    taskElement.addEventListener("click", () => {
      task.completed = !task.completed;
      displayTasks();
      saveTasksToLocalStorage();
    });

    taskElement.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", index);
    });

    taskElement.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    taskElement.addEventListener("drop", (e) => {
      e.preventDefault();
      const fromIndex = e.dataTransfer.getData("text/plain");
      const toIndex = index;
      const temp = tasks[fromIndex];
      tasks[fromIndex] = tasks[toIndex];
      tasks[toIndex] = temp;
      displayTasks();
      saveTasksToLocalStorage();
    });

    tasksList.appendChild(taskElement);
  });
};

const saveTasksToLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasksFromLocalStorage = () => {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    displayTasks();
  }
};

document.getElementById("addButton").addEventListener("click", () => {
  const newTaskInput = document.getElementById("newTaskInput");
  const newTaskText = newTaskInput.value.trim();
  const newTaskDueDate = document.getElementById("dueDateInput").value;

  if (newTaskText) {
    const newTask = {
      text: newTaskText,
      dueDate: newTaskDueDate,
      completed: false,
    };
    tasks.push(newTask);
    newTaskInput.value = "";
    displayTasks();
    saveTasksToLocalStorage();
  }
});

function deleteTask(index) {
  tasks.splice(index, 1);
  displayTasks();
  saveTasksToLocalStorage();
}

window.addEventListener("load", loadTasksFromLocalStorage);