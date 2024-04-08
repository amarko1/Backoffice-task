import {Component, OnInit, ViewChild } from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {TransactionDetailsModalComponent} from "./modal/transaction.details.modal.component";
import {PlayerService} from "../../services/player.service";
import {Player} from "../../models/player.model";
import {TransactionService} from "../../services/transaction.service";
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
  transactions: Transaction[] = [];
  players: Player[] = [];
  selectedTransaction: Transaction | null = null;
  @ViewChild(TransactionDetailsModalComponent) modal! :TransactionDetailsModalComponent;
  isLoading: boolean = true;
  filterForm: FormGroup;

  dataSource = new MatTableDataSource<TableItem>();
  tableConfiguration: TableConfiguration;
  displayedColumns: string[] = [];
  items: any[];


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
      [
        new TableConfigurationProperty('External ID', 'externalId', PropertyType.Text),
        new TableConfigurationProperty('Player', 'playerId', PropertyType.Text),
        new TableConfigurationProperty('Type', 'type', PropertyType.Text),
        new TableConfigurationProperty('Direction', 'direction', PropertyType.Text),
        new TableConfigurationProperty('Provider', 'provider', PropertyType.Text),
      ],
      {
        name: "details",
        action: (element) => this.openTransactionDetails(element)
      }
    );
  }

  private loadItems(filter: any){
    this.isLoading = true;
    this.transactionService.getTransactions(filter).subscribe(transactions => {
      console.log('Tickets loaded:', transactions)
      this.items = transactions;
      this.isLoading = false;
    })
  }
}
