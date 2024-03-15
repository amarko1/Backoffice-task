import {Component, Input} from '@angular/core';
import {Transaction} from "../../../models/transaction.model";
import {PlayerService} from "../../../services/player.service";
import {Player} from "../../../models/player.model";
import {TicketService} from "../../../services/ticket.service";
import {Ticket, TicketFilter, TicketStatus} from "../../../models/ticket.model";
import {transactions} from "../../../data/transaction.data";

@Component({
  selector: 'app-transaction-details-modal',
  templateUrl: 'transaction.details.modal.component.html',
  styleUrls: ['transaction.details.modal.component.scss']
})
export class TransactionDetailsModalComponent {
  @Input() transaction: Transaction | null = null;
  isVisible = false;
  players: Player[] = [];
  tickets: Ticket[] = [];
  isLoading: boolean = true;

  constructor(private playerService: PlayerService, private ticketService: TicketService) {
    this.playerService.getPlayers().subscribe((data) => {
      this.players = data;
    });
  }

  openModal() {
    this.loadLinkedTickets();
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  getPlayerName(playerId: string): string {
    const player = this.players.find(player => player.id === playerId);
    return player ? `${player.firstName} ${player.lastName}` : 'Unknown Player';
  }

  loadLinkedTickets() {
    if (this.transaction) {
      this.isLoading = true;

      const filter: TicketFilter = {
        playerId: this.transaction.playerId,
        status: TicketStatus.Created
      };

      this.ticketService.getTickets(filter).subscribe((filteredTickets) => {
        this.tickets = filteredTickets;
        this.isLoading = false;
      });
    }
  }
}
