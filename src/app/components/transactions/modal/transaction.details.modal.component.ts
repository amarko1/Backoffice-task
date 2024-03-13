import { Component, Input } from '@angular/core';
import {Transaction} from "../../../models/transaction.model";


@Component({
  selector: 'app-transaction-details-modal',
  templateUrl: 'transaction.details.modal.component.html',
  styleUrls: ['transaction.details.modal.component.scss']
})
export class TransactionDetailsModalComponent {
  @Input() transaction: Transaction | null = null;
  isVisible = false;

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }
}
