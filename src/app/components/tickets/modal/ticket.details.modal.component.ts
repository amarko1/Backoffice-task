import {Component, Input, OnInit} from "@angular/core";
import {Ticket} from "../../../models/ticket.model";
import {Transaction, TransactionFilter} from "../../../models/transaction.model";
import {TransactionService} from "../../../services/transaction.service";
import {Player} from "../../../models/player.model";
import {PlayerService} from "../../../services/player.service";

@Component({
  selector: 'app-ticket-details-modal',
  templateUrl: 'ticket.details.modal.component.html',
  styleUrls: ['ticket.details.modal.component.scss']
})
export class TicketDetailsModalComponent implements OnInit {
  @Input() ticket: Ticket | null = null;
  transactions: Transaction[] = [];
  players: Player[] = [];
  isVisible: boolean = false;
  isLoading: boolean = true;

  constructor(private transactionService: TransactionService, private playerService: PlayerService) {}

  ngOnInit(): void {
    this.playerService.getPlayers().subscribe((data) => {
      this.players = data;
    })
  }

  getPlayerName(playerId: string): string {
    const player = this.players.find(player => player.id === playerId);
    return player ? `${player.firstName} ${player.lastName}` : 'Unknown Player';
  }

  openModal() {
    this.loadLinkedTransactions();
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  loadLinkedTransactions() {
    if (this.ticket) {
      this.isLoading = true;
      const filter: TransactionFilter = { externalId: this.ticket.id };

      this.transactionService.getTransactions(filter).subscribe((filteredTransactions) => {
        this.transactions = filteredTransactions;
        this.isLoading = false;
      });
    }
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
