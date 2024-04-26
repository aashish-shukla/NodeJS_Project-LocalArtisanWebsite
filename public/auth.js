document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const response = await fetch('/api/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            if (!response.ok) {
                throw new Error('Authentication failed.');
            }
            
            const data = await response.json();
            const token = data.token;
            
            // Save token to local storage or session storage
            localStorage.setItem('token', token);
            
            // Redirect user to dashboard or another page
            window.location.href = '/dashboard.html';
        } catch (error) {
            console.error('Error:', error);
            // Display error message to user
        }
    });
});
