document.getElementById('addNoteButton').addEventListener('click', function() {
    createNote();
});

function createNote(titleValue = '', contentValue = '', top = '0px', left = '0px', textAlign = 'left', backgroundColor = '#fff0ba') {
    const notesContainer = document.getElementById('notesContainer');

    const note = document.createElement('div');
    note.className = 'note';
    note.style.top = top;
    note.style.left = left;
    note.style.backgroundColor = backgroundColor;

    const title = document.createElement('input');
    title.type = 'text';
    title.className = 'note-title';
    title.placeholder = 'Title...';
    title.value = titleValue;

    const content = document.createElement('textarea');
    content.className = 'note-content';
    content.value = contentValue;
    content.style.textAlign = textAlign;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'fa fa-trash-alt';
    deleteButton.addEventListener('click', () => {
        notesContainer.removeChild(note);
        saveNotes();
    });

    const toggleButton = document.createElement('button');
    toggleButton.className = 'fa fa-eye-slash';
    toggleButton.addEventListener('click', () => {
        buttons.classList.toggle('hidden');
        textAlignButtons.classList.toggle('hidden');
        toggleButton.classList.toggle('fa-eye-slash');
        toggleButton.classList.toggle('fa-eye');
    });

    const undoButton = document.createElement('button');
    undoButton.className = 'fa fa-undo';
    undoButton.addEventListener('click', () => {
        executeCommandOnFocusedElement(content, 'undo');
    });

    const redoButton = document.createElement('button');
    redoButton.className = 'fa fa-redo';
    redoButton.addEventListener('click', () => {
        executeCommandOnFocusedElement(content, 'redo');
    });

    const leftAlignButton = document.createElement('button');
    leftAlignButton.className = 'fa fa-align-left';
    leftAlignButton.addEventListener('click', () => {
        content.style.textAlign = 'left';
        saveNotes();
    });

    const centerAlignButton = document.createElement('button');
    centerAlignButton.className = 'fa fa-align-center';
    centerAlignButton.addEventListener('click', () => {
        content.style.textAlign = 'center';
        saveNotes();
    });

    const rightAlignButton = document.createElement('button');
    rightAlignButton.className = 'fa fa-align-right';
    rightAlignButton.addEventListener('click', () => {
        content.style.textAlign = 'right';
        saveNotes();
    });

    const colorButton = document.createElement('button');
    colorButton.className = 'fa fa-palette';

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.className = 'color-picker';
    colorPicker.value = '#cbedb1'; // Default color matching backgroundColor
    colorPicker.addEventListener('input', (event) => {
        note.style.backgroundColor = event.target.value;
        saveNotes();
    });

    colorButton.appendChild(colorPicker);
    colorButton.addEventListener('click', () => {
        colorPicker.click();
    });

    const zoomInButton = document.createElement('button');
    zoomInButton.className = 'fa fa-search-plus';
    zoomInButton.addEventListener('click', () => {
        changeFontSize(content, 1);
    });

    const zoomOutButton = document.createElement('button');
    zoomOutButton.className = 'fa fa-search-minus';
    zoomOutButton.addEventListener('click', () => {
        changeFontSize(content, -1);
    });

    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    buttons.appendChild(deleteButton);
    buttons.appendChild(undoButton);
    buttons.appendChild(redoButton);

    const textAlignButtons = document.createElement('div');
    textAlignButtons.className = 'text-align-buttons';
    textAlignButtons.appendChild(leftAlignButton);
    textAlignButtons.appendChild(centerAlignButton);
    textAlignButtons.appendChild(rightAlignButton);
    textAlignButtons.appendChild(colorButton);
    textAlignButtons.appendChild(zoomInButton);
    textAlignButtons.appendChild(zoomOutButton);

    note.appendChild(title);
    note.appendChild(content);
    note.appendChild(buttons);
    note.appendChild(textAlignButtons);
    note.appendChild(toggleButton);
    notesContainer.appendChild(note);

    note.draggable = true;
    note.addEventListener('dragstart', dragStart);
    note.addEventListener('drag', drag);
    note.addEventListener('dragend', dragEnd);

    title.addEventListener('input', saveNotes);
    content.addEventListener('input', saveNotes);
}

function dragStart(event) {
    const style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
        (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' +
        (parseInt(style.getPropertyValue("top"), 10) - event.clientY));
}

function drag(event) {
    // To keep visual of dragging element
}

function dragEnd(event) {
    const offset = event.dataTransfer.getData("text/plain").split(',');
    const note = event.target;
    note.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    note.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
    saveNotes();
}

function saveNotes() {
    const notes = [];
    document.querySelectorAll('.note').forEach(note => {
        const title = note.querySelector('.note-title').value;
        const content = note.querySelector('.note-content').value;
        const top = note.style.top;
        const left = note.style.left;
        const textAlign = note.querySelector('.note-content').style.textAlign;
        const backgroundColor = note.style.backgroundColor;
        notes.push({ title, content, top, left, textAlign, backgroundColor });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => {
        createNote(note.title, note.content, note.top, note.left, note.textAlign, note.backgroundColor);
    });
}

function executeCommandOnFocusedElement(element, command) {
    element.focus();
    document.execCommand(command);
}

function changeFontSize(element, change) {
    const currentSize = parseInt(window.getComputedStyle(element, null).getPropertyValue('font-size'));
    const newSize = currentSize + change;
    element.style.fontSize = `${newSize}px`;
}

window.onload = function() {
    loadNotes();
}
