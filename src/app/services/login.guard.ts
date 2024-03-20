import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class LoginRedirectGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const isAuth = await this.userService.isAuthorized();
    if (isAuth) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
