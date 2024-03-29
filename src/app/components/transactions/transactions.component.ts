import {Component, OnInit, ViewChild } from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {transactions} from "../../data/transaction.data";
import {TransactionDetailsModalComponent} from "./modal/transaction.details.modal.component";
import {PlayerService} from "../../services/player.service";
import {Player} from "../../models/player.model";
import {TransactionService} from "../../services/transaction.service";
import {filter} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {
  PropertyType,
  TableConfiguration,
  TableConfigurationProperty,
  TableItem
} from "../configuration/table.component.configuration";

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

  dataSource = new MatTableDataSource<TableItem>();
  tableConfiguration: TableConfiguration;
  displayedColumns: string[] = [];
  public columnMap = {
    'External ID': 'externalId',
    'Player': 'playerId',
    'Type': 'type',
    'Direction': 'direction',
    'Provider': 'provider',
  };

  constructor(private playerService: PlayerService,
              private transactionService: TransactionService,
              private fb: FormBuilder)
  {
    this.filterForm = this.fb.group({
      playerId: [null],
      externalId: ['', Validators.pattern(/^\d+$/)],
      type: [null],
      direction: [null],
      provider: [null],
      startDate: [null],
      endDate: [null],
    });
  }

  ngOnInit() {
    this.loadPlayers();
    this.prepareTableConfiguration();
    this.loadItems(this.filterForm.value);
  }

  sortPlayers() {
    this.players.sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`;
      const nameB = `${b.firstName} ${b.lastName}`;
      return nameA.localeCompare(nameB);
    });
  }

  loadPlayers(){
    this.playerService.getPlayers().subscribe((data) => {
      this.players = data;
      this.sortPlayers();
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
    const filter = this.filterForm.value;
    this.loadItems(filter);
  }
  reset() {
    this.filterForm.reset({
      playerId: null,
      externalId: null,
      type: null,
      direction: null,
      provider: null,
      startDate: null,
      endDate: null,
    });
    this.loadItems(this.filterForm.value);
  }

  private prepareTableConfiguration() {
    this.tableConfiguration = new TableConfiguration(
      '',
      [
        new TableConfigurationProperty('External ID', '', PropertyType.Text),
        new TableConfigurationProperty('Player', '', PropertyType.Text),
        new TableConfigurationProperty('Type', '', PropertyType.Text),
        new TableConfigurationProperty('Direction', '', PropertyType.Text),
        new TableConfigurationProperty('Provider', '', PropertyType.Text),
      ],
      {
        name: "Details",
        action: (element) => this.openTransactionDetails(element)
      }
    );
  }

  private loadItems(filter: any) {
    this.isLoading = true;
    this.transactionService.getTransactions(filter).subscribe(tickets => {
      this.dataSource.data = tickets.map(transaction => new TableItem({
        id: transaction.id,
        externalId: transaction.externalId,
        playerId: transaction.playerId,
        createdAt: transaction.createdAt,
        type: transaction.type,
        direction: transaction.direction,
        provider: transaction.provider,
        amount: transaction.amount,
        currency: transaction.currency
      }));
      this.isLoading = false;
    });
  }
}
