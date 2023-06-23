import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  message = '';
  isSubmitting = false;
  registerForm: FormGroup;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: [''],
    }, {
      validators: this.passwordConfirming,
    });
  }

  ngOnInit(): void {}

  passwordConfirming(c: FormGroup): { invalid: boolean } | null {
    if (c.get('password')?.value !== c.get('confirmPassword')?.value) {
        return {invalid: true};
    }
    return null;
  }

  getControl(controlName: string): AbstractControl | null {
    return this.registerForm.get(controlName);
  }

  register(): void {
    this.isSubmitting = true;
    this.message = '';

    if (this.registerForm.status === 'INVALID') {
      this.message = 'Please correct the form before submitting';
      this.isSubmitting = false;
      return;
    }

    this.userService.registerUser(this.registerForm.value).subscribe(
      response => {
        this.message = 'Registration successful!';
        this.isSubmitting = false;
        this.router.navigate(['/trade']);  // redirect to the trade component
      },
      error => {
        console.log(error); // Log the error object to the console
        this.isSubmitting = false;
        if (error.error && error.error.message) {
          // If the error object has a 'message' property, use that
          this.message = error.error.message;
        } else {
          // Otherwise, just say that registration failed
          this.message = 'Registration failed!';
        }
      }
    );
  }
}
