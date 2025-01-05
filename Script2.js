document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('searchButton').addEventListener('click', function () {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const notes = document.querySelectorAll('.note');

        notes.forEach(note => {
            const title = note.querySelector('.note-title').value.toLowerCase();
            const content = note.querySelector('.note-content').value.toLowerCase();

            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                note.style.display = 'block';
            } else {
                note.style.display = 'none';
            }
        });
    });
});