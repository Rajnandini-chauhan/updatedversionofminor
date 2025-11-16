document.addEventListener('DOMContentLoaded', function() {
    const loginCard = document.getElementById('loginCard');
    const registerCard = document.getElementById('registerCard');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');
    const regErrorAlert = document.getElementById('regErrorAlert');
    const regSuccessAlert = document.getElementById('regSuccessAlert');

    // Switch between login and register forms
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        loginCard.style.display = 'none';
        registerCard.style.display = 'block';
    });

    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        registerCard.style.display = 'none';
        loginCard.style.display = 'block';
    });

    // Show alert message
    function showAlert(alertElement, message, type) {
        alertElement.textContent = message;
        alertElement.style.display = 'block';
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 5000);
    }

    // Login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(loginForm);
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitButton.disabled = true;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                showAlert(successAlert, data.message, 'success');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                showAlert(errorAlert, data.message, 'error');
            }
        } catch (error) {
            showAlert(errorAlert, 'Network error. Please try again.', 'error');
        } finally {
            // Restore button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });

    // Register form submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            showAlert(regErrorAlert, 'Passwords do not match!', 'error');
            return;
        }

        // Validate password length
        if (password.length < 6) {
            showAlert(regErrorAlert, 'Password must be at least 6 characters long!', 'error');
            return;
        }

        const formData = new FormData(registerForm);
        const submitButton = registerForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitButton.disabled = true;

        try {
            const response = await fetch('/register', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                showAlert(regSuccessAlert, data.message, 'success');
                setTimeout(() => {
                    registerCard.style.display = 'none';
                    loginCard.style.display = 'block';
                    registerForm.reset();
                }, 2000);
            } else {
                showAlert(regErrorAlert, data.message, 'error');
            }
        } catch (error) {
            showAlert(regErrorAlert, 'Network error. Please try again.', 'error');
        } finally {
            // Restore button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
});
