import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Ticket, TicketFilter} from '../models/ticket.model';
import {tickets} from '../data/ticket.data';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor() { }

  public getTicket(id: string): Observable<Ticket> {
    const ticket = tickets.find(t => t.id === id);
    return of(ticket);
  }

  public getTickets(filter: TicketFilter): Observable<Ticket[]> {
    const filteredTickets = tickets.filter(
      t => (!filter.playerId || t.playerId === filter.playerId) &&
        (!filter.status || t.status === filter.status) &&
        (!filter.createdFrom || t.createdAt >= filter.createdFrom) &&
        (!filter.createdTo || t.createdAt <= filter.createdTo)
    );

    return of(filteredTickets);
  }
}
