import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = true;

  constructor(private router: Router) {}

  onLogin(): void {
    this.errorMessage = '';

    if (this.isSubmitting) {
      return;
    }

    if (this.username && this.password) {
      this.isSubmitting = true;

      // Simulate a successful login after 1 second.
      // Replace this with your actual authentication service.
      setTimeout(() => {
        this.router.navigate(['/trade']);
        this.isSubmitting = false;
      }, 1000);
    } else {
      this.errorMessage = 'Please enter your username and password.';
    }
  }
}
