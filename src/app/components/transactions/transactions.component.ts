import {Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {TransactionService} from "../../services/transaction.service";
import {Transaction} from "../../models/transaction.model";
import {Router} from "@angular/router";
import {transactions} from "../../data/transaction.data";
import {TransactionDetailsModalComponent} from "./modal/transaction.details.modal.component";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  filters: any = {};
  transactions: Transaction[] = [];
  selectedTransaction: Transaction | null = null;
  @ViewChild(TransactionDetailsModalComponent) modal! :TransactionDetailsModalComponent;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadTransactions();
  }

  openTransactionDetails(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.modal.transaction = this.selectedTransaction;
    this.modal.openModal();
  }

  onFilter() {
    this.transactions = transactions.filter(transaction => {
      const matchesPlayerId = !this.filters.playerId || transaction.playerId === this.filters.playerId;
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
