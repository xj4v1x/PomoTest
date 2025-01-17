
const menu_card = document.getElementById('menu_drag');
const pomodoro_bottom = document.getElementById('pomodoro_bottom');
const pomodoro_bottom_y = parseInt(pomodoro_bottom.getBoundingClientRect().y); // 732px
const pomodoro_width = parseInt(pomodoro_bottom.getBoundingClientRect().width);
let menu_card_medidas = menu_card.getBoundingClientRect();
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
    if (isDragging) {        
        const menu_card_medidas = menu_card.getBoundingClientRect(); // Obtén las coordenadas actualizadas

        // Calcula la posición máxima permitida (mínimo y límite inferior)
        const maxTop = pomodoro_bottom_y - menu_card_medidas.height; // Límite superior
        const maxLeft = pomodoro_width - menu_card_medidas.width; // Límite superior       
        const newLeft = Math.min(
            Math.max(event.clientX - offsetX, menu_card_medidas.width/2),
            maxLeft+menu_card_medidas.width/2);
        
        const newTop = Math.min(
            Math.max(event.clientY - offsetY, menu_card_medidas.height), // Límite superior: no salga por arriba
            maxTop+menu_card_medidas.height/2 // Límite inferior
        );        

        // Aplica las posiciones calculadas al div
        menu_card.style.left = `${newLeft}px`;
        menu_card.style.top = `${newTop}px`;

        // Debugging
        console.log(`menu_card_medidas.y: ${menu_card_medidas.y}, maxTop: ${maxTop}, newTop: ${newTop}`);
    }
});


window.addEventListener('mouseup', () => {
    isDragging = false; // Finaliza el arrastre
    menu_card.style.cursor = 'grab'; // Restablece el cursor
});

// getBoundingClientRect
