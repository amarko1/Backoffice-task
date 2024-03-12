import { Component } from '@angular/core';
import { UserService } from 'app/services/user.service';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
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
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = 'Login failed';
      }
    });
  }
}
