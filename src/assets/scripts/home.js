const PORT = window.location.port ?? '';

// DOM Elements
const bookList = document.getElementById('bookList');
const bookListContent = document.getElementById('bookListContent');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('emptyState');
const createBookBtn = document.getElementById('createBookBtn');
const emptyStateBtn = document.getElementById('emptyStateBtn');

// Modal Elements
const bookModal = document.getElementById('bookModal');
const deleteModal = document.getElementById('deleteModal');
const modalTitle = document.getElementById('modalTitle');
const bookForm = document.getElementById('bookForm');
const cancelBtn = document.getElementById('cancelBtn');
const submitBtn = document.getElementById('submitBtn');
const closeModalButtons = document.querySelectorAll('.close-modal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Form Elements
const bookIdInput = document.getElementById('bookId');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const imageUrlInput = document.getElementById('image_url');
const genreSelect = document.getElementById('genre');
const publisherInput = document.getElementById('publisher');
const pagesInput = document.getElementById('pages');
const publishedDateInput = document.getElementById('published_date');
const sinopsisInput = document.getElementById('sinopsis');
const readingTimeSelect = document.getElementById('reading_time');

// State
let books = [];
let currentBookId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', init);

function init() {
  // Add event listeners
  createBookBtn.addEventListener('click', openCreateBookModal);
  emptyStateBtn.addEventListener('click', openCreateBookModal);
  bookForm.addEventListener('submit', handleFormSubmit);
  cancelBtn.addEventListener('click', closeBookModal);
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);

  closeModalButtons.forEach((button) => {
    button.addEventListener('click', function () {
      bookModal.style.display = 'none';
      deleteModal.style.display = 'none';
    });
  });

  // Initialize navbar
  initNavbar();

  // Load books
  fetchBooks();
}

// API Functions
async function fetchBooks() {
  try {
    showLoading();

    // Simulate API call with a delay (replace with actual fetch in production)
    const response = await fetch(`http://localhost:${PORT}/books`);
    const data = await response.json();
    // Simulate API response for demo purposes
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // const data = []; // Empty array for demo, replace with actual data

    books = data;
    renderBooks();
  } catch (error) {
    console.error('Error fetching books:', error);
    showError(
      'No se pudieron cargar los libros. Por favor, intenta de nuevo más tarde.'
    );
  } finally {
    hideLoading();
  }
}

async function createBook(bookData) {
  try {
    // Simulate API call (replace with actual fetch in production)
    const response = await fetch(`http://localhost:${PORT}/books/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData)
    });
    const data = await response.json();

    books.push(data);
    renderBooks();
    return data;
  } catch (error) {
    console.error('Error creating book:', error);
    throw new Error('No se pudo crear el libro');
  }
}

async function updateBook(id, bookData) {
  try {
    // Simulate API call (replace with actual fetch in production)
    const response = await fetch(
      `http://localhost:${PORT}/books/update/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...bookData })
      }
    );
    const data = await response.json();

    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books[index] = {
        ...books[index],
        ...data
      };
    }

    renderBooks();
    return data;
  } catch (error) {
    console.error(`Error updating book with id ${id}:`, error);
    throw new Error('No se pudo actualizar el libro');
  }
}

async function deleteBook(id) {
  try {
    // Simulate API call (replace with actual fetch in production)
    // const response = await fetch(`${API_URL}/${id}`, {
    //     method: 'DELETE',
    // });
    // const data = await response.json();
    await fetch(`http://localhost:${PORT}/books/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      // const data = await response.json();

      books = books.filter((book) => book.id !== id);

      renderBooks();
      return { success: true };
    });
  } catch (error) {
    console.error(`Error deleting book with id ${id}:`, error);
    throw new Error('No se pudo eliminar el libro');
  }
}

// UI Functions
function renderBooks() {
  if (books.length === 0) {
    bookList.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  bookList.style.display = 'block';
  emptyState.style.display = 'none';

  bookListContent.innerHTML = '';

  books.forEach((book) => {
    const bookElement = document.createElement('div');
    bookElement.className = 'book-item';

    const publishedYear = book.published_date
      ? new Date(book.published_date).getFullYear()
      : '';
    const pages = book.pages ? `${book.pages} págs` : '';
    const meta = [publishedYear, pages].filter(Boolean).join(' • ');

    bookElement.innerHTML = `
            <div class="book-image">
                ${
                  book.image_url
                    ? `<img src="${book.image_url}" alt="${book.title}" onerror="this.onerror=null; this.src='/placeholder.svg'; this.parentElement.textContent='No img';">`
                    : 'No img'
                }
            </div>
            <div class="book-title">
                <span class="book-title-text">[${book.id}] ${book.title}</span>
                <span class="book-meta">${meta}</span>
            </div>
            <div data-label="Autor:">${book.author || '-'}</div>
            <div data-label="Género:">${book.genre || '-'}</div>
            <div data-label="Editorial:">${book.publisher || '-'}</div>
            <div class="book-actions">
                <button class="action-btn edit" data-id="${
                  book.id
                }" aria-label="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                </button>
                <button class="action-btn delete" data-id="${
                  book.id
                }" aria-label="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;

    // Add event listeners to the buttons
    const editBtn = bookElement.querySelector('.edit');
    const deleteBtn = bookElement.querySelector('.delete');

    editBtn.addEventListener('click', () => openEditBookModal(book.id));
    deleteBtn.addEventListener('click', () => openDeleteModal(book.id));

    bookListContent.appendChild(bookElement);
  });
}

function showLoading() {
  loading.style.display = 'flex';
  bookList.style.display = 'none';
  emptyState.style.display = 'none';
}

function hideLoading() {
  loading.style.display = 'none';
}

function showError(message) {
  // You can implement a toast or alert here
  alert(message);
}

// Modal Functions
function openCreateBookModal() {
  modalTitle.textContent = 'Crear Nuevo Libro';
  submitBtn.textContent = 'Crear Libro';
  resetForm();
  bookModal.style.display = 'block';
  currentBookId = null;
  titleInput.focus();
}

function openEditBookModal(id) {
  const book = books.find((book) => book.id === id);
  if (!book) return;

  modalTitle.textContent = 'Editar Libro';
  submitBtn.textContent = 'Actualizar Libro';

  // Fill the form with book data
  bookIdInput.value = book.id;
  titleInput.value = book.title || '';
  authorInput.value = book.author || '';
  imageUrlInput.value = book.image_url || '';
  genreSelect.value = book.genre || '';
  publisherInput.value = book.publisher || '';
  pagesInput.value = book.pages || '';

  if (book.published_date) {
    const date = new Date(book.published_date);
    publishedDateInput.value = date.toISOString().split('T')[0];
  } else {
    publishedDateInput.value = '';
  }

  sinopsisInput.value = book.sinopsis || '';
  readingTimeSelect.value = book.reading_time || '';

  currentBookId = id;
  bookModal.style.display = 'block';
  titleInput.focus();
}

function closeBookModal() {
  bookModal.style.display = 'none';
  resetForm();
}

function openDeleteModal(id) {
  currentBookId = id;
  deleteModal.style.display = 'block';

  // Set up the confirm delete button
  confirmDeleteBtn.onclick = async () => {
    confirmDeleteBtn.textContent = 'Eliminando...';
    confirmDeleteBtn.disabled = true;

    try {
      await deleteBook(id);
      closeDeleteModal();
    } catch (error) {
      showError(error.message);
    } finally {
      confirmDeleteBtn.textContent = 'Eliminar';
      confirmDeleteBtn.disabled = false;
    }
  };
}

function closeDeleteModal() {
  deleteModal.style.display = 'none';
  currentBookId = null;
}

function resetForm() {
  bookForm.reset();
  bookIdInput.value = '';
}

// Form Handling
async function handleFormSubmit(e) {
  e.preventDefault();

  const isEditing = !!currentBookId;
  submitBtn.textContent = isEditing ? 'Actualizando...' : 'Creando...';
  submitBtn.disabled = true;

  try {
    const formData = {
      title: titleInput.value,
      author: authorInput.value,
      image_url: imageUrlInput.value,
      genre: genreSelect.value,
      publisher: publisherInput.value,
      pages: pagesInput.value ? parseInt(pagesInput.value) : null,
      published_date: publishedDateInput.value
        ? new Date(publishedDateInput.value)
        : null,
      sinopsis: sinopsisInput.value,
      reading_time: readingTimeSelect.value
    };

    if (isEditing) {
      await updateBook(currentBookId, formData);
    } else {
      await createBook(formData);
    }

    closeBookModal();
  } catch (error) {
    showError(error.message);
  } finally {
    submitBtn.textContent = isEditing ? 'Actualizar Libro' : 'Crear Libro';
    submitBtn.disabled = false;
  }
}

// Window click event to close modals when clicking outside
window.onclick = function (event) {
  if (event.target === bookModal) {
    closeBookModal();
  }
  if (event.target === deleteModal) {
    closeDeleteModal();
  }
};

// // Navbar Elements
// const userName = document.getElementById('userName');
// const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');

// // Mock user data - replace with actual user data from your authentication system
// const currentUser = {
//   name: 'Juan Pérez',
//   email: 'juan.perez@ejemplo.com'
// };

// // Update user info in navbar
// function updateUserInfo() {
//   userName.textContent = currentUser.name;
//   userEmail.textContent = currentUser.email;
// }

// Handle logout
function handleLogout() {
  // Add your logout logic here
  // For example: redirect to login page, clear session, etc.
  if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
    fetch(`http://localhost:${PORT}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Usuario cerró sesión');
        if (data.redirect) {
          window.location.href = data.redirect;
        }
      })
      .catch((error) => console.log(error));
  }
}

// Add to init function
function initNavbar() {
  //   updateUserInfo();
  logoutBtn.addEventListener('click', handleLogout);
}
