/**
 * Login Form - TypeScript Implementation
 * A modern, type-safe login form component
 */

interface LoginCredentials {
  email: string;
  password: string;
}

interface ValidationError {
  field: keyof LoginCredentials;
  message: string;
}

class LoginForm {
  private form: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private passwordInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorContainer: HTMLDivElement;
  private isSubmitting: boolean = false;

  constructor(formSelector: string) {
    this.form = document.querySelector(formSelector) as HTMLFormElement;
    if (!this.form) throw new Error(`Form not found: ${formSelector}`);

    this.emailInput = this.form.querySelector('input[name="email"]') as HTMLInputElement;
    this.passwordInput = this.form.querySelector('input[name="password"]') as HTMLInputElement;
    this.submitButton = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorContainer = this.form.querySelector('.error-container') as HTMLDivElement;

    if (!this.emailInput || !this.passwordInput || !this.submitButton) {
      throw new Error('Required form elements not found');
    }

    this.init();
  }

  private init(): void {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.emailInput.addEventListener('blur', () => this.validateEmail());
    this.passwordInput.addEventListener('blur', () => this.validatePassword());
    this.emailInput.addEventListener('input', () => this.clearErrors());
    this.passwordInput.addEventListener('input', () => this.clearErrors());
  }

  private getCredentials(): LoginCredentials {
    return {
      email: this.emailInput.value.trim(),
      password: this.passwordInput.value,
    };
  }

  private validateEmail(): boolean {
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

  private validatePassword(): boolean {
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

  private validateForm(): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!this.validateEmail()) {
      errors.push({ field: 'email', message: 'Invalid email' });
    }

    if (!this.validatePassword()) {
      errors.push({ field: 'password', message: 'Invalid password' });
    }

    return errors;
  }

  private displayError(field: keyof LoginCredentials, message: string): void {
    const fieldElement = this.form.querySelector(`[data-field="${field}"]`);
    if (fieldElement) {
      fieldElement.classList.add('error');
      const errorText = fieldElement.querySelector('.error-text');
      if (errorText) {
        errorText.textContent = message;
      }
    }
  }

  private clearFieldError(field: keyof LoginCredentials): void {
    const fieldElement = this.form.querySelector(`[data-field="${field}"]`);
    if (fieldElement) {
      fieldElement.classList.remove('error');
    }
  }

  private clearErrors(): void {
    const errorElements = this.form.querySelectorAll('.error');
    errorElements.forEach((el) => el.classList.remove('error'));
  }

  private async handleSubmit(e: Event): Promise<void> {
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
          // Redirect or handle success
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

  private showFormError(message: string): void {
    this.errorContainer.textContent = message;
    this.errorContainer.style.display = 'block';
  }

  private async submitLogin(
    credentials: LoginCredentials
  ): Promise<{ success: boolean; message: string }> {
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

  public reset(): void {
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
