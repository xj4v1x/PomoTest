const draggable = document.getElementById('draggable');
const menu_card = document.getElementById('menu_drag');
const pomodoro_bottom = document.getElementById('pomodoro_bottom');
let pomodoro_bottom_y = pomodoro_bottom.getBoundingClientRect();
pomodoro_bottom_y = pomodoro_bottom_y.y;
console.log(pomodoro_bottom_y);

        let isDragging = false; // Indica si está en movimiento
        let offsetX = 0; // Diferencia horizontal entre el mouse y el div
        let offsetY = 0; // Diferencia vertical entre el mouse y el div

        menu_card.addEventListener('mousedown', (event) => {
            isDragging = true; // Inicia el arrastre
            offsetX = event.clientX - menu_card.offsetLeft; // Calcula la diferencia horizontal
            offsetY = event.clientY - menu_card.offsetTop;  // Calcula la diferencia vertical
            menu_card.style.cursor = 'grabbing'; // Cambia el cursor al arrastrar
        });

        window.addEventListener('mousemove', (event) => {            
            const menu_card_medidas = menu_card.getBoundingClientRect();
            let menu_card_y = menu_card_medidas.y + menu_card_medidas.height;
            if (isDragging && (menu_card_medidas.y + menu_card_medidas.height)<parseInt(pomodoro_bottom_y)) {
                // Calcula la nueva posición del div
                menu_card.style.left = `${event.clientX - offsetX}px`;
                menu_card.style.top = `${event.clientY - offsetY}px`;
                
            }
            if ((menu_card_medidas.y + menu_card_medidas.height)>=parseInt(pomodoro_bottom_y)) {
                event.clientY = 0;
                menu_card.style.top = `300px`;
                return;

            }
            console.log(menu_card_medidas.height);
            console.log(menu_card_medidas.y + menu_card_medidas.height + " / " + parseInt(pomodoro_bottom_y))
            
            
        });
        window.addEventListener('mouseup', () => {
            isDragging = false; // Finaliza el arrastre
            menu_card.style.cursor = 'grab'; // Restablece el cursor
        });

        // getBoundingClientRect