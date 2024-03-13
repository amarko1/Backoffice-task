import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const isAuth = await this.userService.isAuthorized();
      if (!isAuth) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    } catch (error) {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
