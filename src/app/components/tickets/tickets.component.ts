import {Component, OnInit, ViewChild} from '@angular/core';
import {Ticket} from "../../models/ticket.model";
import {tickets} from "../../data/ticket.data";
import {TicketDetailsModalComponent} from "./modal/ticket.details.modal.component";
import {Player} from "../../models/player.model";
import {PlayerService} from "../../services/player.service";
import {players} from "../../data/player.data";

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  filters: any = {};
  tickets: Ticket[] = [];
  players: Player[] = [];
  selectedTickets: Ticket | null = null;
  isLoadingPlayers: boolean = true;
 @ViewChild(TicketDetailsModalComponent) modal! :TicketDetailsModalComponent;

  constructor(private playerService: PlayerService) { }

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
    const filterPlayerNameLower = this.filters.playerName?.toLowerCase();

    const filteredPlayerIds = this.players
      .filter(player =>
        player.firstName.toLowerCase().includes(filterPlayerNameLower) ||
        player.lastName.toLowerCase().includes(filterPlayerNameLower))
      .map(player => player.id);

    this.tickets = tickets.filter(ticket => {
      const matchesPlayerId = !this.filters.playerName || filteredPlayerIds.includes(ticket.playerId);
      const matchesStatus = !this.filters.status || ticket.status === this.filters.status;
      const matchesDateRange = !this.filters.startDate && !this.filters.endDate ||
        (this.filters.startDate && new Date(ticket.createdAt) >= new Date(this.filters.startDate)) &&
        (this.filters.endDate && new Date(ticket.createdAt) <= new Date(this.filters.endDate));

      return matchesPlayerId && matchesStatus && matchesDateRange;
    });
  }

  reset(){
    this.filters = {};
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
