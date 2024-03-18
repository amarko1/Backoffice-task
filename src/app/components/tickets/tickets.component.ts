import {Component, OnInit, ViewChild} from '@angular/core';
import {Ticket} from "../../models/ticket.model";
import {tickets} from "../../data/ticket.data";
import {TicketDetailsModalComponent} from "./modal/ticket.details.modal.component";
import {Player} from "../../models/player.model";
import {PlayerService} from "../../services/player.service";
import {TicketService} from "../../services/ticket.service";

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  filters: any = { playerId: '', status:''};
  tickets: Ticket[] = [];
  players: Player[] = [];
  selectedTickets: Ticket | null = null;
  isLoading: boolean = true;
 @ViewChild(TicketDetailsModalComponent) modal! :TicketDetailsModalComponent;

  constructor(
    private playerService: PlayerService, private ticketService: TicketService
  ) { }

  ngOnInit(): void {
    this.loadTickets();
    this.isLoading = true;
      this.playerService.getPlayers().subscribe((data) => {
        this.players = data;
        this.sortPlayers();
        this.isLoading = false;
      });
  }

  sortPlayers() {
    this.players.sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`;
      const nameB = `${b.firstName} ${b.lastName}`;
      return nameA.localeCompare(nameB);
    });
  }

  getPlayerName(playerId: string): string {
    const player = this.players.find(player => player.id === playerId);
    return player ? `${player.firstName} ${player.lastName}` : 'Unknown Player';
  }

  loadTickets(filters?: any) {
    this.tickets = tickets;
  }

  openTransactionDetails(ticket: Ticket) {
    this.selectedTickets = ticket;
    this.modal.ticket = this.selectedTickets;
    this.modal.openModal();
  }

  onFilter() {
    this.isLoading = true;
    this.ticketService.getTickets(this.filters).subscribe( tickets => {
      this.tickets = tickets;
      this.isLoading = false;
    })
  }

  reset(){
    this.filters = { playerId:'', status: ''};
    this.loadTickets();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Won':
        return 'status-won';
      case 'Lost':
        return 'status-lost';
      default:
        return 'status-other';
    }
  }
}
