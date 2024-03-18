import { Component } from '@angular/core';
import { UserService } from 'app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent {
  username: string;
  password: string;
  errorMessage: string;

  constructor(private userService: UserService, private router: Router) {}

  login() {
    this.userService.login(this.username, this.password).subscribe({
      next: (user) => {
        this.router.navigate(['dashboard']);
      },
      error: (error) => {
        alert("Wrong username or password")
        console.error('Login error:', error);
      }
    });
  }
}
