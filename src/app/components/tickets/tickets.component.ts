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
  filters: any = { status: ''};
  tickets: Ticket[] = [];
  players: Player[] = [];
  selectedTickets: Ticket | null = null;
  isLoadingPlayers: boolean = true;
 @ViewChild(TicketDetailsModalComponent) modal! :TicketDetailsModalComponent;

  constructor(
    private playerService: PlayerService, private ticketService: TicketService
  ) { }

  ngOnInit(): void {
    this.loadTickets();
    this.isLoadingPlayers = true;
      this.playerService.getPlayers().subscribe((data) => {
        this.players = data;
        this.isLoadingPlayers = false;
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
    const filterPlayerNameLower = this.filters.playerName?.toLowerCase().split(' ').filter(word => word.length > 0);

    this.tickets = tickets.filter(ticket => {
      const player = this.players.find(p => p.id === ticket.playerId);
      if (!player) return false;

      const fullNameLower = `${player.firstName.toLowerCase()} ${player.lastName.toLowerCase()}`;

      const matchesPlayerName = filterPlayerNameLower.every(part => fullNameLower.includes(part));

      const matchesStatus = !this.filters.status || ticket.status === this.filters.status;
      const matchesDateRange = !this.filters.startDate && !this.filters.endDate ||
        (this.filters.startDate && new Date(ticket.createdAt) >= new Date(this.filters.startDate)) &&
        (this.filters.endDate && new Date(ticket.createdAt) <= new Date(this.filters.endDate));

      return matchesPlayerName && matchesStatus && matchesDateRange;
    });
  }

  reset(){
    this.filters = { status: ''};
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
