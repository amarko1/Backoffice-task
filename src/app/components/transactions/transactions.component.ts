import {Component, OnInit, ViewChild } from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {transactions} from "../../data/transaction.data";
import {TransactionDetailsModalComponent} from "./modal/transaction.details.modal.component";
import {PlayerService} from "../../services/player.service";
import {Player} from "../../models/player.model";
import {TransactionService} from "../../services/transaction.service";
import {filter} from "rxjs";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})

export class TransactionsComponent implements OnInit {
  filters: any = { playerId:'',type:'', direction: '', provider:'' };
  transactions: Transaction[] = [];
  players: Player[] = [];
  selectedTransaction: Transaction | null = null;
  @ViewChild(TransactionDetailsModalComponent) modal! :TransactionDetailsModalComponent;
  isLoading: boolean = true;

  constructor(private playerService: PlayerService, private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadTransactions();
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

  openTransactionDetails(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.modal.transaction = this.selectedTransaction;
    this.modal.openModal();
  }

  onFilter() {
    this.isLoading = true;
    this.transactionService.getTransactions(this.filters).subscribe(transactions =>{
      this.transactions = transactions;
      this.isLoading = false;
    });
  }

  loadTransactions(filters?: any) {
    this.transactions = transactions;
  }
  reset() {
    this.filters = {playerId:'' ,type:'',direction: '',provider:''};
    this.loadTransactions();
  }
}
