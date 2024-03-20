import {Component} from "@angular/core";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {Grant} from "../../models/user.model";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent{
  protected readonly Grant = Grant;
  constructor(private userService: UserService,
              private router: Router,
              private translate: TranslateService
  ) {}
  logout() {
    this.userService.logout();
    this.router.navigate(['login']);
  }

  hasGrant(grant: Grant): boolean {
    const currentUser = this.userService.getCurrentUser();
    return currentUser && currentUser.grants.includes(grant);
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  changeLanguage(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const language = selectElement.value;
    this.switchLanguage(language);
  }
}
