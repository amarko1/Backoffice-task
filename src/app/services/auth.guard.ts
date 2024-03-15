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

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredGrants = route.data['grants'] as Grant[] || [];
    const currentUser = this.userService.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    const hasRequiredGrants = requiredGrants.every(grant => currentUser.grants.includes(grant));

    if (!hasRequiredGrants) {
      window.alert("Cannot acces");
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
