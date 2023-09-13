import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Player} from '../models/player.model';
import {players} from '../data/player.data';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor() { }

  public getPlayers(): Observable<Player[]> {
    return of(players);
  }
}
