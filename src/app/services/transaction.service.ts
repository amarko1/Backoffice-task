import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Transaction, TransactionFilter} from '../models/transaction.model';
import {transactions} from '../data/transaction.data';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor() { }

  public getTransaction(id: string): Observable<Transaction> {
    const transaction = transactions.find(t => t.id === id);
    return of(transaction);
  }

  public getTransactions(filter: TransactionFilter): Observable<Transaction[]> {
    const filteredTransactions = transactions.filter(
      t => (!filter.playerId || t.playerId === filter.playerId) &&
        (!filter.externalId || t.externalId === filter.externalId) &&
        (!filter.type || t.type === filter.type) &&
        (!filter.provider || t.provider === filter.provider) &&
        (!filter.direction || t.direction === filter.direction) &&
        (!filter.createdFrom || t.createdAt >= filter.createdFrom) &&
        (!filter.createdTo || t.createdAt <= filter.createdTo)
    );

    return of(filteredTransactions);
  }
}
