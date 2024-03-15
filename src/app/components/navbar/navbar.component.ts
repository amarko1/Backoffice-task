import {Component} from "@angular/core";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {Grant} from "../../models/user.model";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent{
  protected readonly Grant = Grant;
  constructor(private userService: UserService, private router: Router) {}

  logout() {
    this.userService.logout();
    this.router.navigate(['login']);
  }

  hasGrant(grant: Grant): boolean {
    const currentUser = this.userService.getCurrentUser();
    return currentUser && currentUser.grants.includes(grant);
  }
}
