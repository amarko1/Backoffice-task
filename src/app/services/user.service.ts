import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {User} from '../models/user.model';
import {users} from '../data/user.data';

export enum StorageKey {
  CurrentUser = 'CurrentUser'
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUser: User;

  constructor() { }

  public login(username: string, password: string): Observable<User> {
    this.loadCurrentUser();
    if (this.currentUser) {
      return throwError(() => new Error('logged-in'));
    }

    username = username.trim();
    password = password.trim();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      this.currentUser = user;
      localStorage.setItem(StorageKey.CurrentUser, JSON.stringify(this.currentUser));
      return of(this.currentUser);
    } else {
      return throwError(() => new Error('unknown'));
    }
  }

  public logout(): Observable<any> {
    this.loadCurrentUser();
    if (!this.currentUser) {
      return throwError(() => new Error('logged-out'));
    }

    this.currentUser = null;
    localStorage.removeItem(StorageKey.CurrentUser);
    return of('logout-success');
  }

  public isAuthorized(): Observable<boolean> {
    this.loadCurrentUser();
    return of(!!this.currentUser);
  }

  public getCurrentUser(): User {
    this.loadCurrentUser();
    return this.currentUser;
  }

  private loadCurrentUser(): void {
    if (!this.currentUser) {
      const currentUserString = localStorage.getItem(StorageKey.CurrentUser);
      if (currentUserString) {
        this.currentUser = JSON.parse(currentUserString);
      }
    }
  }
}
