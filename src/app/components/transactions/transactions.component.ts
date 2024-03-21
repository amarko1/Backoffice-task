import {Component, OnInit, ViewChild } from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {transactions} from "../../data/transaction.data";
import {TransactionDetailsModalComponent} from "./modal/transaction.details.modal.component";
import {PlayerService} from "../../services/player.service";
import {Player} from "../../models/player.model";
import {TransactionService} from "../../services/transaction.service";
import {filter} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
  filterForm: FormGroup;

  constructor(private playerService: PlayerService,
              private transactionService: TransactionService,
              private fb: FormBuilder)
  {
    this.filterForm = this.fb.group({
      playerId: [''],
      externalId: ['', Validators.pattern(/^\d+$/)],
      type: [''],
      direction: [''],
      provider: [''],
      startDate: [''],
      endDate: [''],
    });
  }

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
    const formValues = this.filterForm.value;
    this.transactionService.getTransactions(formValues).subscribe(transactions =>{
      this.transactions = transactions;
      this.isLoading = false;
    });
  }
  loadTransactions(filters?: any) {
    this.transactions = transactions;
  }

  reset() {
    this.filterForm.reset({
      playerId: '',
      externalId: '',
      type: '',
      direction: '',
      provider: '',
      startDate: '',
      endDate: '',
    });
    this.loadTransactions();
  }
}
