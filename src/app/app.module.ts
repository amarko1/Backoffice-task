import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {AppComponent} from './app.component';
import { LoginComponent } from './components/login/login.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./services/auth.guard";
import {CommonModule} from "@angular/common";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import { TransactionsComponent } from './components/transactions/transactions.component';
import {NavbarComponent} from "./components/navbar/navbar.component";
import {TransactionDetailsModalComponent} from "./components/transactions/modal/transaction.details.modal.component";
import { TicketsComponent } from './components/tickets/tickets.component';
import {TicketDetailsModalComponent} from "./components/tickets/modal/ticket.details.modal.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
  { path: 'tickets', component: TicketsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    TransactionsComponent,
    NavbarComponent,
    TransactionDetailsModalComponent,
    TicketsComponent,
    TicketDetailsModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
