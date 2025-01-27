document.addEventListener("DOMContentLoaded", () => {

	// Selecciona el elemento <ul> con id tasks_list
	const tasksList = document.querySelector("#tasks_list");
	// Selecciona el input Add Task
	const addTaskInput = document.getElementById("addtask_input");
	const addtask_button = document.getElementById("addtask_button");

	let draggingItem = null;

addtask_button.addEventListener("click", function(event) {
	saveTask();
});


addTaskInput.addEventListener("keypress", function(event) {
  // Cuando se pulsa Enter
	if (event.key === "Enter") {
		addTaskInput.blur();
		event.preventDefault();		
    	// Ejecuta la función saveTask		
		saveTask();		
	}	
}); 

  // Grabar nueva tarea
	const saveTask = () => {		
		const newTaskText = addTaskInput.value.trim();
		if (newTaskText) {
			// Crea un nuevo elemento <li>
			const newTask = document.createElement("li");
			// Y le establece el atributo draggable = true
			newTask.setAttribute("draggable", "true");
			newTask.classList.add("taskinlist");
			// Inserta el texto que teníamos en el input			
			//newTask.textContent = newTaskText;
			const taskContent = document.createElement("span");
			taskContent.textContent = newTaskText;

			// Botones
			const taskeditbuttons = createButton('<span class="material-symbols-outlined">menu</span>', "taskEdit_btn");
			taskeditbuttons.style.zIndex="3";
			const editButton = createButton('<span class="material-symbols-outlined">edit</span>', "editTask_btn");
			const deleteButton = createButton('<span class="material-symbols-outlined">delete</span>', "deleteTask_btn");
			const completeButton = createButton('<span class="material-symbols-outlined">check</span>', "completeTask_btn");

			const taskButtons = document.createElement("div");
			taskButtons.classList.add("taskseditcontainer");
			taskButtons.append(editButton, deleteButton, completeButton);
			// Añade este nuevo li delante del primer hijo (en primera posición)			
			newTask.append(taskContent, taskeditbuttons, taskButtons);
			tasksList.insertBefore(newTask, tasksList.children[1]);		

			// Vacía el input
			addTaskInput.value = "";

			// Añade eventos a los botones
			taskeditbuttons.addEventListener("click", (event) => opentasksedit(event.currentTarget));
			editButton.addEventListener("click", () => editTask(newTask));
			deleteButton.addEventListener("click", () => deleteTask(newTask));
			completeButton.addEventListener("click", () => completeTask(newTask));
			const event = new Event('taskAddedOrNot');
			document.dispatchEvent(event);
		}		
};


const opentasksedit = (taskEditButton) => {
	// Resetear z-index de todos los botones al base
	document.querySelectorAll(".taskEdit_btn").forEach((btn) => {
		btn.style.zIndex = 10; // Z-index base
	});
	document.querySelectorAll(".taskseditcontainer").forEach((container) => {
        container.style.zIndex = 5; // Z-index base
    });
	// Elevar los valores relacionados con el botón actual
    taskEditButton.style.zIndex = 20; // Más alto que todos los demás

    const taskButtons = taskEditButton.closest("li").querySelector(".taskseditcontainer");
	taskButtons.style.zIndex = 15;
    if (taskButtons) {
        taskButtons.classList.toggle("visible");
    }
};


const editTask = (task) => {
    const taskContent = task.querySelector("span");

    // Crea un input para editar
    const input = document.createElement("input");
    input.type = "text";
    input.value = taskContent.textContent;
    input.classList.add("task-edit-input");

    // Reemplaza el span por el input temporalmente
    task.replaceChild(input, taskContent);

    // Autoenfoca y selecciona el texto
    input.focus();
    input.select();

    // Maneja el guardado en los eventos blur o Enter
    input.addEventListener("blur", () => finishEditingTask(task, input));
    input.addEventListener("keypress", (event) => {
		if (event.key === "Enter") {
			finishEditingTask(task, input);
		}
    });
	const taskButtons = document.getElementById("taskseditcontainer");
	taskButtons.classList.toggle("visible");
};
const finishEditingTask = (task, input) => {
    const newText = input.value.trim() || "Tarea vacía"; // Asegúrate de tener texto
    const taskContent = document.createElement("span");
    taskContent.textContent = newText;
    // Reemplaza el input por el span
    task.replaceChild(taskContent, input);
};

const deleteTask = (task) => {
	tasksList.removeChild(task);	
	const event = new Event('taskAddedOrNot');
	document.dispatchEvent(event);
};

const completeTask = (task) => {
	task.classList.toggle("complete");
	const taskButtons = document.getElementById("taskseditcontainer");
	taskButtons.classList.toggle("visible");
};
const createButton = (html, className) => {
    const button = document.createElement("button");
    button.innerHTML = html;
    button.classList.add(className);
    return button;
};









// Al arrastrar
tasksList.addEventListener("dragstart", (e) => {
	// Previene arrastrar elementos que no son "draggables"
    if (e.target.getAttribute("draggable") === "false") {
		e.preventDefault();
		return;
    }
    draggingItem = e.target;
	// Le añade la clase dragging	
    e.target.classList.add("dragging");
	// El z-index del elemento arrastrado siempre por encima
    e.target.style.zIndex = 9999;
});

// Cuando termina de arrastrar
tasksList.addEventListener("dragend", (e) => {
	// Le quita la clase dragging	
    e.target.classList.remove("dragging");
	// Restablece el z-index
    e.target.style.zIndex = "";	
	// Vacía draggingItem
    draggingItem = null;	
});

// Al estar siendo arrastrado
tasksList.addEventListener("dragover", (e) => {
    e.preventDefault();	
    const afterElement = getDragAfterElement(tasksList, e.clientY);
    if (draggingItem && afterElement) {
		tasksList.insertBefore(draggingItem, afterElement);
    } else if (draggingItem) {
		tasksList.appendChild(draggingItem);
    }
});


function getDragAfterElement(container, y) {
    const draggableElements = [
		...container.querySelectorAll('li[draggable="true"]:not(.dragging)'),
    ];
    return draggableElements.reduce(
		(closest, child) => {
			const box = child.getBoundingClientRect();
			const offset = y - box.top - box.height / 2;
			if (offset < 0 && offset > closest.offset) {
				return { offset: offset, element: child };
			} else {
				return closest;
			}
		},
		{ offset: Number.NEGATIVE_INFINITY }
    ).element;
	}
});
