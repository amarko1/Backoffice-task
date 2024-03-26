import {Component, OnInit, ViewChild} from '@angular/core';
import {Ticket} from "../../models/ticket.model";
import {tickets} from "../../data/ticket.data";
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
} from "../../configuration/table.configuration.models";

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  @ViewChild(TicketDetailsModalComponent) modal!: TicketDetailsModalComponent;
  filterForm: FormGroup;
  filteredTickets: Ticket[] = [];
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

  constructor(
    private playerService: PlayerService,
    private ticketService: TicketService,
    private fb: FormBuilder,
  ) {
    this.filterForm = this.fb.group({
      playerId: [null],
      status: [null],
      startDate: [null],
      endDate: [null]
    });
  }

  ngOnInit(): void {
    this.tableConfiguration = new TableConfiguration(
      '',
      [
        new TableConfigurationProperty('Player', '', PropertyType.Text),
        new TableConfigurationProperty('Bets', '', PropertyType.Text),
        new TableConfigurationProperty('Pay in', '', PropertyType.Number),
        new TableConfigurationProperty('Pay out', '', PropertyType.Number),
        new TableConfigurationProperty('Currency', '', PropertyType.Text),
        new TableConfigurationProperty('Status', '', PropertyType.Text)
      ],
      {
        name: "Details",
        action: (element) => this.openTransactionDetails(element)
      }
    );

    const filter = this.filterForm.value;
    this.ticketService.getTickets(filter).subscribe(tickets => {
      this.dataSource.data = tickets.map(ticket => new TableItem({
        id: ticket.id,
        playerId: ticket.playerId,
        createdAt: ticket.createdAt,
        payInAmount: ticket.payInAmount,
        payOutAmount: ticket.payOutAmount,
        currency: ticket.currency,
        status: ticket.status,
        bets: ticket.bets.map(bet => `${bet.participants.join(' vs ')}: ${bet.status} at ${bet.odds}`).join('\n')
      }, PropertyType.Text));
    });





    this.loadTickets();
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

  loadTickets(filters?: any) {
    this.filteredTickets = tickets;
  }

  openTransactionDetails(ticket: Ticket) {
    this.selectedTickets = ticket;
    this.modal.ticket = this.selectedTickets;
    this.modal.openModal();
  }

  onFilter() {
    this.isLoading = true;
    const filter = this.filterForm.value;
    this.ticketService.getTickets(filter).subscribe(tickets => {
      this.filteredTickets = tickets;
      this.isLoading = false;
    })
  }

  reset() {
    this.filterForm.reset({
      playerId: null,
      status: null,
      startDate: null,
      endDate: null
    });
    this.loadTickets();
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

  applyFilters(filters: any[]) {
    // Prođite kroz sve filtere i dodajte ili uklonite kontrolu ovisno o stanju checked
    filters.forEach(filter => {
      if (filter.checked && !this.filterForm.contains(filter.value)) {
        // Ako je filter odabran i kontrola ne postoji, dodajte kontrolu
        this.filterForm.addControl(filter.value, this.fb.control(null));
      } else if (!filter.checked && this.filterForm.contains(filter.value)) {
        // Ako filter nije odabran i kontrola postoji, uklonite kontrolu
        this.filterForm.removeControl(filter.value);
      }
    });
    this.closeFiltersModal();
  }

  openFiltersModal() {
    this.isFiltersModalOpen = true;
  }

  closeFiltersModal() {
    this.isFiltersModalOpen = false;
  }

}
