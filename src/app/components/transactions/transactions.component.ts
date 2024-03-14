import {Component, OnInit, ViewChild } from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {transactions} from "../../data/transaction.data";
import {TransactionDetailsModalComponent} from "./modal/transaction.details.modal.component";
import {PlayerService} from "../../services/player.service";
import {Player} from "../../models/player.model";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})

export class TransactionsComponent implements OnInit {
  filters: any = {};
  transactions: Transaction[] = [];
  players: Player[] = [];
  selectedTransaction: Transaction | null = null;
  @ViewChild(TransactionDetailsModalComponent) modal! :TransactionDetailsModalComponent;
  isLoadingPlayers: boolean = true;

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.loadTransactions();
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

  openTransactionDetails(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.modal.transaction = this.selectedTransaction;
    this.modal.openModal();
  }

  onFilter() {
    const filterPlayerNameLower = this.filters.playerName?.toLowerCase();

    // Filtriraj ID-ove igrača koji odgovaraju unesenom imenu
    const filteredPlayerIds = this.players
      .filter(player =>
        player.firstName.toLowerCase().includes(filterPlayerNameLower) ||
        player.lastName.toLowerCase().includes(filterPlayerNameLower))
      .map(player => player.id);

    this.transactions = transactions.filter(transaction => {
      // Provjeri odgovara li ID igrača u transakciji filtriranim ID-ovima
      const matchesPlayerId = !this.filters.playerName || filteredPlayerIds.includes(transaction.playerId);
      const matchesExternalId = !this.filters.externalId || transaction.externalId === this.filters.externalId;
      const matchesType = !this.filters.type || transaction.type === this.filters.type;
      const matchesDirection = !this.filters.direction || transaction.direction === this.filters.direction;
      const matchesProvider = !this.filters.provider || transaction.provider === this.filters.provider;
      const matchesDateRange = !this.filters.createdFrom && !this.filters.createdTo ||
        (this.filters.createdFrom && new Date(transaction.createdAt) >= new Date(this.filters.createdFrom)) &&
        (this.filters.createdTo && new Date(transaction.createdAt) <= new Date(this.filters.createdTo));

      return matchesPlayerId && matchesExternalId && matchesType &&
        matchesDirection && matchesProvider && matchesDateRange;
    });
  }

  loadTransactions(filters?: any) {
    this.transactions = transactions;
  }
  reset() {
    this.filters = {};
    this.loadTransactions();
  }
}
