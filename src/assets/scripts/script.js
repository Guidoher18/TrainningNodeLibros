document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const togglePasswordButton = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eyeIcon');
  const eyeOffIcon = document.getElementById('eyeOffIcon');

  // Toggle password visibility
  togglePasswordButton.addEventListener('click', function () {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.add('hidden');
      eyeOffIcon.classList.remove('hidden');
      togglePasswordButton.setAttribute('aria-label', 'Ocultar contraseña');
    } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('hidden');
      eyeOffIcon.classList.add('hidden');
      togglePasswordButton.setAttribute('aria-label', 'Mostrar contraseña');
    }
  });

  // Form submission
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
  });

  const authReg = (ep = 'auth') => {
    const body = {
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };

    const PORT = window.location.port ?? '';
    return fetch(`http://localhost:${PORT}/login/${ep}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  };

  document.querySelector('#login').addEventListener('click', (e) => {
    e.preventDefault();
    const res = authReg();
    res
      .then((res) => res.json())
      .then((data) => {
        if (data.redirect) {
          window.location.href = data.redirect;
        }
      })
      .catch((error) => console.log(error));
  });

  document.querySelector('#register').addEventListener('click', (e) => {
    e.preventDefault();
    const res = authReg('register');

    res
      .then((res) => res.json())
      .then((data) => {
        if (data.redirect) {
          window.location.href = data.redirect;
        }
      })
      .catch((error) => console.log(error));
  });
});
