/**
 * Login Form - JavaScript Implementation (Compiled from TypeScript)
 * A modern, type-safe login form component
 */

class LoginForm {
  constructor(formSelector) {
    this.isSubmitting = false;
    this.form = document.querySelector(formSelector);
    if (!this.form) throw new Error(`Form not found: ${formSelector}`);

    this.emailInput = this.form.querySelector('input[name="email"]');
    this.passwordInput = this.form.querySelector('input[name="password"]');
    this.submitButton = this.form.querySelector('button[type="submit"]');
    this.errorContainer = this.form.querySelector('.error-container');

    if (!this.emailInput || !this.passwordInput || !this.submitButton) {
      throw new Error('Required form elements not found');
    }

    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.emailInput.addEventListener('blur', () => this.validateEmail());
    this.passwordInput.addEventListener('blur', () => this.validatePassword());
    this.emailInput.addEventListener('input', () => this.clearErrors());
    this.passwordInput.addEventListener('input', () => this.clearErrors());
  }

  getCredentials() {
    return {
      email: this.emailInput.value.trim(),
      password: this.passwordInput.value,
    };
  }

  validateEmail() {
    const email = this.emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      this.displayError('email', 'Email is required');
      return false;
    }

    if (!emailRegex.test(email)) {
      this.displayError('email', 'Please enter a valid email address');
      return false;
    }

    this.clearFieldError('email');
    return true;
  }

  validatePassword() {
    const password = this.passwordInput.value;

    if (!password) {
      this.displayError('password', 'Password is required');
      return false;
    }

    if (password.length < 6) {
      this.displayError('password', 'Password must be at least 6 characters');
      return false;
    }

    this.clearFieldError('password');
    return true;
  }

  validateForm() {
    const errors = [];

    if (!this.validateEmail()) {
      errors.push({ field: 'email', message: 'Invalid email' });
    }

    if (!this.validatePassword()) {
      errors.push({ field: 'password', message: 'Invalid password' });
    }

    return errors;
  }

  displayError(field, message) {
    const fieldElement = this.form.querySelector(`[data-field="${field}"]`);
    if (fieldElement) {
      fieldElement.classList.add('error');
      const errorText = fieldElement.querySelector('.error-text');
      if (errorText) {
        errorText.textContent = message;
      }
    }
  }

  clearFieldError(field) {
    const fieldElement = this.form.querySelector(`[data-field="${field}"]`);
    if (fieldElement) {
      fieldElement.classList.remove('error');
    }
  }

  clearErrors() {
    const errorElements = this.form.querySelectorAll('.error');
    errorElements.forEach((el) => el.classList.remove('error'));
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (this.isSubmitting) return;

    const validationErrors = this.validateForm();
    if (validationErrors.length > 0) {
      return;
    }

    this.isSubmitting = true;
    this.submitButton.disabled = true;
    this.submitButton.textContent = 'Logging in...';

    try {
      const credentials = this.getCredentials();
      const response = await this.submitLogin(credentials);

      if (response.success) {
        console.log('Login successful!', response.message);
        this.form.classList.add('success');
        setTimeout(() => {
          console.log('Redirecting...');
        }, 1000);
      } else {
        this.showFormError(response.message);
      }
    } catch (error) {
      this.showFormError('An error occurred during login. Please try again.');
      console.error('Login error:', error);
    } finally {
      this.isSubmitting = false;
      this.submitButton.disabled = false;
      this.submitButton.textContent = 'Sign In';
    }
  }

  showFormError(message) {
    this.errorContainer.textContent = message;
    this.errorContainer.style.display = 'block';
  }

  async submitLogin(credentials) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock validation - replace with actual API call
        if (
          credentials.email === 'demo@example.com' &&
          credentials.password === 'password'
        ) {
          resolve({ success: true, message: 'Login successful' });
        } else {
          resolve({ success: false, message: 'Invalid email or password' });
        }
      }, 800);
    });
  }

  reset() {
    this.form.reset();
    this.clearErrors();
    this.errorContainer.style.display = 'none';
    this.form.classList.remove('success');
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LoginForm('#login-form');
  });
} else {
  new LoginForm('#login-form');
}
