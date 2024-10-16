let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

document.addEventListener('DOMContentLoaded', () => {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.getElementById('note-list');

  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);

  getAndRenderNotes();
});

const getNotes = () =>
  fetch('http://localhost:3001/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
  fetch('http://localhost:3001/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`http://localhost:3001/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderNoteList = (notes) => {
  noteList.innerHTML = '';
  notes.forEach((note) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `
      <span class="list-item-title">${note.title}</span>
      <i class="fas fa-trash-alt float-right text-danger delete-note"></i>
    `;
    li.dataset.note = JSON.stringify(note);
    li.querySelector('.list-item-title').addEventListener('click', handleNoteView);
    li.querySelector('.delete-note').addEventListener('click', handleNoteDelete);
    noteList.appendChild(li);
  });
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleNoteDelete = (e) => {
  e.stopPropagation();
  const note = e.target.parentElement;
  const noteId = JSON.parse(note.dataset.note).id;

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleNoteView = (e) => {
  e.preventDefault();
  const note = JSON.parse(e.target.parentElement.dataset.note);
  renderActiveNote(note);
};

const handleNewNoteView = () => {
  renderActiveNote({});
};

const renderActiveNote = (note = {}) => {
  noteTitle.value = note.title || '';
  noteText.value = note.text || '';
  noteTitle.removeAttribute('readonly');
  noteText.removeAttribute('readonly');

  if (note.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
  }

  handleRenderSaveBtn();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    saveNoteBtn.style.display = 'none';
  } else {
    saveNoteBtn.style.display = 'inline';
  }
};

const getAndRenderNotes = () => {
  getNotes()
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetched notes:', data);
      renderNoteList(data);
    })
    .catch((error) => {
      console.error('Error fetching notes:', error);
    });
};