import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter.modal.component.html',
  styleUrls: ['./filter.modal.component.scss']
})
export class FilterModalComponent {
  @Input() filters: any[] = [];
  @Input() showModal: boolean = false;
  @Output() applyFilters = new EventEmitter<any[]>();
  @Output() closeFilters = new EventEmitter<void>();

  toggleFilter(index: number) {
    this.filters[index].checked = !this.filters[index].checked;
  }
  applyAndClose() {
    this.applyFilters.emit(this.filters);
  }
  close() {
    this.closeFilters.emit();
  }
}
