// Test for book.controller.ts
let cookies = '';
let book = { id: 0 };

const login = async () => {
  // 1. Inicialización
  await fetch('http://localhost:3009/login/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'admin',
      email: 'a@a.com',
      password: '1234'
    })
  }).then(async (res) => {
    cookies = res.headers.getSetCookie()[0];
  });
};

describe('BOOK', () => {
  beforeAll(async () => {
    await login();
  });

  test('GetById | Status 200 [OK]', async () => {
    // 2. Estímulo
    const resBook = await fetch('http://localhost:3009/books/2', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies
      }
    });

    book = await resBook.json();

    // 3. Observo el comportamiento
    expect(resBook.status).toBe(200);

    //   console.log('data :>> ', data);
  });

  test('GetById | Object [Book] with all properties', async () => {
    // 2. Estimulo = book
    // 3. Observo el comportamiento
    expect(book).toHaveProperty('id');
    expect(book).toHaveProperty('title');
    expect(book).toHaveProperty('author');
    expect(book).toHaveProperty('image_url');
    expect(book).toHaveProperty('genre');
    expect(book).toHaveProperty('publisher');
    expect(book).toHaveProperty('pages');
    expect(book).toHaveProperty('published_date');
    expect(book).toHaveProperty('sinopsis');
    expect(book).toHaveProperty('reading_time');
    expect(book).toHaveProperty('createdAt');
    expect(book).toHaveProperty('updatedAt');

    expect(book.id).toBeGreaterThanOrEqual(0);
  });
});
