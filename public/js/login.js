document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            displayError(data.error);
        } else {
            console.log("asdfasdf")
            // Save the token in localStorage or sessionStorage
            localStorage.setItem('token', data.token);
            // Redirect to landing page upon successful login
            window.location.href = '/landing'; // Redirect to landing page
        }
    })
    .catch(error => {
        // console.error('Error:', error);
        displayError('Wrong email or Password. Please try again.');
    });
});

function displayError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.innerText = message;
}

