import {AfterViewInit, ChangeDetectorRef, Component, NgModule, NgZone, OnInit, ViewChild} from '@angular/core';
import {Ticket} from "../../models/ticket.model";
import {TicketDetailsModalComponent} from "./modal/ticket.details.modal.component";
import {Player} from "../../models/player.model";
import {PlayerService} from "../../services/player.service";
import {TicketService} from "../../services/ticket.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {
  PropertyType,
  TableConfiguration,
  TableConfigurationProperty,
  TableItem
} from "../configuration/table.component.configuration";


@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  @ViewChild(TicketDetailsModalComponent) modal!: TicketDetailsModalComponent;
  filterForm: FormGroup;
  tickets: Ticket[] = [];
  players: Player[] = [];
  selectedTickets: Ticket | null = null;
  isLoading: boolean = true;
  isFiltersModalOpen = false;

  filters = [
    {label: 'Player', value: 'playerId', checked: true},
    {label: 'Status', value: 'status', checked: true},
    {label: 'Start date', value: 'startDate', checked: true},
    {label: 'End date', value: 'endDate', checked: true},
  ]
  dataSource = new MatTableDataSource<TableItem>();
  tableConfiguration: TableConfiguration;
  displayedColumns: string[] = [];
  items: any[];

constructor(
    private playerService: PlayerService,
    private ticketService: TicketService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    this.filterForm = this.fb.group({
      playerId: [null],
      status: [null],
      startDate: [null],
      endDate: [null]
    });
  }

  ngOnInit() {
    this.prepareTableConfiguration();
    const filter = this.filterForm.value;
    this.loadItems(filter);
    this.loadPlayers();
    this.checkForSavedFilters();
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

  openTransactionDetails(ticket: Ticket) {
    this.selectedTickets = ticket;
    this.modal.ticket = this.selectedTickets;
    this.modal.openModal();
  }

  onFilter() {
    this.loadItems(this.filterForm.value);
  }

  reset() {
     this.filterForm.reset({
      playerId: null,
      status: null,
      startDate: null,
      endDate: null
    });
    this.loadItems(this.filterForm.value);
  }

  applyFilters(filters: any[]) {
    filters.forEach(filter => {
      if (filter.checked && !this.filterForm.contains(filter.value)) {
        this.filterForm.addControl(filter.value, this.fb.control(null));
      } else if (!filter.checked && this.filterForm.contains(filter.value)) {
        this.filterForm.removeControl(filter.value);
      }
    });
    const filtersState = filters.reduce((acc, curr) => {
      acc[curr.value] = curr.checked;
      return acc;
    }, {});
    localStorage.setItem('filtersState', JSON.stringify(filtersState));

    this.closeFiltersModal();
  }

  checkForSavedFilters() {
    const savedFiltersState = JSON.parse(localStorage.getItem('filtersState'));

    if (savedFiltersState) {
      this.filters = this.filters.map(filter => {
        const isChecked = !!savedFiltersState[filter.value];
        if (isChecked) {
          if (!this.filterForm.contains(filter.value)) {
            this.filterForm.addControl(filter.value, this.fb.control(null));
          }
        } else {
          if (this.filterForm.contains(filter.value)) {
            this.filterForm.removeControl(filter.value);
          }
        }
        return { ...filter, checked: isChecked };
      });
    } else {
      this.filters.forEach(filter => {
        filter.checked = true;
        if (!this.filterForm.contains(filter.value)) {
          this.filterForm.addControl(filter.value, this.fb.control(null));
        }
      });
    }
  }

  openFiltersModal() {
    this.isFiltersModalOpen = true;
  }

  closeFiltersModal() {
    this.isFiltersModalOpen = false;
  }

  private prepareTableConfiguration() {
    this.tableConfiguration = new TableConfiguration(
      [
        new TableConfigurationProperty('Player', 'playerId', PropertyType.Text),
        new TableConfigurationProperty('Bets', 'bets', PropertyType.Text),
        new TableConfigurationProperty('Pay in', 'payInAmount', PropertyType.Number),
        new TableConfigurationProperty('Pay out', 'payOutAmount', PropertyType.Number),
        new TableConfigurationProperty('Currency', 'currency', PropertyType.Text),
        new TableConfigurationProperty('Status', 'status', PropertyType.Text)
      ],
      {
        name: "details",
        action: (element) => this.openTransactionDetails(element)
      }
    );
  }

  private loadItems(filter: any){
    this.isLoading = true;
    this.ticketService.getTickets(filter).subscribe(tickets => {
      console.log('Tickets loaded:', tickets)
      this.items = tickets;
      this.isLoading = false;
    })
  }
}
