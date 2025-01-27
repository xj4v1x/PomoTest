// Selecciona todos los elementos con la clase draggable
const draggables = document.querySelectorAll('.draggable');

// Selecciona el elemento con el id pomodoro_core
const container = document.getElementById('pomodoro_core');
const px = document.getElementById('x');
const py = document.getElementById('y');

const taskIcon = document.getElementById('tasks_icon_wrapper');
taskIcon.addEventListener('dblclick', (e) => {
    const taskScreen = document.getElementById('tasks_drag');
    taskScreen.classList.remove('minimize');
});

// MOVER ICONOS
const draggableWrappers = document.querySelectorAll('.draggable-wrapper');
draggableWrappers.forEach(wrapper => {
    const overlay = wrapper.querySelector('.draggable-overlay');
    let isDragging = false;
    let offsetX, offsetY;

    // Cuando el mouse se presiona sobre el overlay, comenzamos el arrastre
    overlay.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Para evitar que el navegador trate de arrastrar la imagen

        // Marcamos que estamos en el proceso de arrastre
        isDragging = true;

        // Calculamos las posiciones iniciales del mouse relativo al contenedor
        offsetX = e.clientX - wrapper.getBoundingClientRect().left;
        offsetY = e.clientY - wrapper.getBoundingClientRect().top;

        // Cambiar el cursor durante el arrastre
        wrapper.style.cursor = 'grabbing';
    });

    // Movimiento del mouse mientras arrastramos
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            // Calculamos las nuevas posiciones usando el desplazamiento del mouse
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;

            // Aplicamos las nuevas posiciones al contenedor
            wrapper.style.left = `${newX}px`;
            wrapper.style.top = `${newY}px`;
        }
    });

    // Cuando se suelta el mouse, detenemos el arrastre
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            wrapper.style.cursor = 'grab'; // Restauramos el cursor normal
        }
    });
});
// MOVER ICONOS

// Resetea el zIndex para que la última ventana siempre esté arriba
function resetzIndex() {
    const allWindows = [...document.querySelectorAll('.screen')];
    allWindows.forEach((window) => {
        window.style.zIndex = 1;
    });
}

// Por cada elemento draggable de la lista de draggables
draggables.forEach(draggable => {
    // Selecciona el header de la ventana
    const header = draggable.querySelector('.header');
    
    // Botones de control de ventanas
    const minimize = draggable.querySelector('.minimize');
    const maximize = draggable.querySelector('.maximize');
    const close = draggable.querySelector('.close');
    
    // Elemento para resize
    const resizeHandle = draggable.querySelector('.resize-handle');

    // Flag para saber si estamos redimensionando
    let resizing = false;
    let initialWidth, initialHeight, initialX, initialY, initialTop, initialLeft;

    // Si tiene header le añadimos el evento mousedown al header
    if (header) {
        header.addEventListener('mousedown', onMouseDown);        
    } else {
        // En caso contrario el evento controla toda la ventana
        draggable.addEventListener('mousedown', onMouseDown);        
    }

    // FUNCION RESIZE DESACTIVADO (puedes descomentarla si la necesitas en el futuro)
    /*
    if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', function (e) {
            resizing = true;
            const rect = draggable.getBoundingClientRect();
            initialWidth = rect.width;
            initialHeight = rect.height;
            initialTop = rect.top + rect.height/2;
            initialLeft = rect.left + rect.width/2;
            initialX = e.clientX;
            initialY = e.clientY;
            e.preventDefault();
        });
    }
    */

    // Si la ventana tiene botones de control se les añade el evento
    if (minimize) {
        minimize.addEventListener("click", function () {
            draggable.classList.toggle("minimize");
        });
        close.addEventListener("click", function(){
            draggable.classList.toggle("minimize");
        });
    }

    // Función para mover las ventanas
    function onMouseDown(event) {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // Resetea el zIndex para que siempre esté arriba la última
        if (draggable.classList.contains("screen")) {
            resetzIndex();
            draggable.style.zIndex = 2;
        }

        const rect = draggable.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calcula los offsets para arrastrar desde el centro de la ventana
        const offsetX = (event.clientX - rect.left) - rect.width / 2;
        const offsetY = (event.clientY - rect.top) - rect.height / 2;

        function onMouseMove(event) {
            // Nuevas coordenadas
            let newX = event.clientX - offsetX;
            let newY = event.clientY - offsetY;
            
            // Limitando la posición dentro del contenedor
            newX = Math.max(containerRect.left + rect.width / 2, Math.min(newX, containerRect.right - rect.width / 2));
            newY = Math.max(containerRect.top + rect.height / 2, Math.min(newY, containerRect.bottom - rect.height / 2));

            draggable.style.left = `${newX}px`;
            draggable.style.top = `${newY}px`;
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    // Resize de las ventanas (desactivado por el momento)
    /*
    document.addEventListener('mousemove', function (e) {
        const rect = draggable.getBoundingClientRect();
        const minWidth = 250;
        const maxWidth = 500;
        const minHeight = 200;
        const maxHeight = 450;

        if (resizing) {
            const dx = e.clientX - initialX;
            const dy = e.clientY - initialY;

            const newWidth = Math.max(Math.min(initialWidth + dx, maxWidth), minWidth);
            const newHeight = Math.max(Math.min(initialHeight + dy, maxHeight), minHeight);

            const deltaWidth = initialWidth - newWidth;
            const deltaHeight = initialHeight - newHeight;

            const newLeft = initialLeft - deltaWidth / 2;
            const newTop = initialTop - deltaHeight / 2;

            draggable.style.width = `${newWidth}px`;
            draggable.style.height = `${newHeight}px`;
            draggable.style.left = `${newLeft}px`;
            draggable.style.top = `${newTop}px`;
        }
    });

    document.addEventListener('mouseup', function () {
        if (resizing) {
            resizing = false;
        }
    });
    */
});

// Ajuste dinámico de la altura del contenedor de tareas
const adjustContainerHeight = () => {
    const taskList = document.querySelector('#tasks_list');
    const tasksDragWindow = document.querySelector('#tasks_drag');

    if (taskList && tasksDragWindow) {
        const totalHeight = taskList.scrollHeight;
        tasksDragWindow.style.height = `${totalHeight + 50}px`;
    } else {
        console.error("No se encontró el contenedor de tareas o la ventana.");
    }
};

// Escuchar el evento para ajustar la altura
document.addEventListener('taskAddedOrNot', adjustContainerHeight);
