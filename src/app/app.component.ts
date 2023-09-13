import {Component, OnInit} from '@angular/core';
import {TicketService} from './services/ticket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private readonly ticketService: TicketService
  ) {
  }

  public ngOnInit(): void {
    this.ticketService.getTickets({}).subscribe(
      tickets => console.log(tickets)
    );
  }
}
