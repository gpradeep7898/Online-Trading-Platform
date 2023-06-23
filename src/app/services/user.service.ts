import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: any[] = [];

  constructor(private http: HttpClient) {
    const users = localStorage.getItem('users');
    if(users) {
      this.users = JSON.parse(users);
    }
  }

  registerUser(user: any): Observable<any> {
    const foundUser = this.users.find(u => u.username === user.username);
    if(foundUser) {
      // Simulate error observable
      return of({success: false, message: 'Username already exists!'});
    } else {
      this.users.push(user);
      localStorage.setItem('users', JSON.stringify(this.users));
      // Simulate success observable
      return of({success: true, message: 'User registered successfully'});
    }
  }

  loginUser(user: any): Observable<any> {
    const foundUser = this.users.find(u => u.username === user.username && u.password === user.password);
    if(foundUser) {
      // Simulate success observable
      return of({success: true, message: 'Login successful'});
    } else {
      // Simulate error observable
      return of({success: false, message: 'Invalid username or password'});
    }
  }

  logoutUser(): void {
    // You can implement logout functionality here as you need.
    // As we're not dealing with authentication here, this can be left as is.
  }
}
