import { Component, OnInit } from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {TransactionService} from "../../services/transaction.service";
import {UserService} from "../../services/user.service";
import {transactions} from "../../data/transaction.data";
import {tickets} from "../../data/ticket.data";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalTransactions: number = transactions.length;
  totalTickets: number = tickets.length;
  username: string = '';

  constructor(private authService: UserService) {}

  ngOnInit() {
    this.username = this.authService.getCurrentUser().username;
  }
}
