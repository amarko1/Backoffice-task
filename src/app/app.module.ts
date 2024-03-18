import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {Grant} from "./models/user.model";
import {LoginRedirectGuard} from "./services/login.guard";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";


const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginRedirectGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [AuthGuard],
    data: { grants: [Grant.CanViewTransactions] }
  },
  {
    path: 'tickets',
    component: TicketsComponent,
    canActivate: [AuthGuard],
    data: { grants: [Grant.CanViewTickets] }
  },
];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    RouterModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
