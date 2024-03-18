import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import { UserService } from './user.service';
import {map, Observable} from "rxjs";
import {Grant} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const currentUser = this.userService.getCurrentUser();
    const requiredGrants = route.data['grants'] as Grant[] || [];
    const hasRequiredGrants = requiredGrants.every(grant => currentUser.grants.includes(grant));

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!hasRequiredGrants) {
      window.alert("Cannot access");
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
