import {Component} from "@angular/core";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {Grant} from "../../models/user.model";
import {TranslateService} from "@ngx-translate/core";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent{
  protected readonly Grant = Grant;
  faArrowRightFromBracket = faArrowRightFromBracket
  selectedLanguage: string;
  constructor(private userService: UserService,
              private router: Router,
              private translate: TranslateService
  )
  {
    this.selectedLanguage = this.translate.currentLang || 'hr';
  }
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

  changeLanguage(language: string) {
    this.switchLanguage(language);
  }
}
