document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5000/register/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.errors) {
            // Display validation errors
            document.getElementById('error-message').innerText = data.errors.map(err => err.msg).join(', ');
        } else if (data.error) {
            // Display server errors
            document.getElementById('error-message').innerText = data.error;
        } else {
            // Display success message
            document.getElementById('error-message').innerText = data.message;
            // Optionally redirect to login page or other page
            // window.location.href = '/login.html';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Add event listeners for OAuth buttons (Google, GitHub) as needed
document.querySelector('.oauth-button.google').addEventListener('click', function() {
    window.location.href = '/register/google';
});

document.querySelector('.oauth-button.github').addEventListener('click', function() {
    window.location.href = '/register/github';
});



