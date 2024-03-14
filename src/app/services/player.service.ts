import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Player} from '../models/player.model';
import {players} from '../data/player.data';
import {WebUtils} from '../utils/web.utils';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private players: Player[] = [];

  constructor() {
    this.loadPlayers();
  }
  private loadPlayers(): void {
    this.getPlayers().subscribe((data) => {
      this.players = data;
    });
  }
  public getPlayerIdByName(name: string): string | undefined {
    const foundPlayer = this.players.find(player =>
      `${player.firstName} ${player.lastName}`.toLowerCase() === name.toLowerCase());
    return foundPlayer?.id;
  }

  public getPlayers(): Observable<Player[]> {
    return WebUtils.mockSuccess('getPlayers', {}, players);
  }
}
