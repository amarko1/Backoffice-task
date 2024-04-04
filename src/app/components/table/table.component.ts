
import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PropertyType, TableConfiguration, TableItem} from "../configuration/table.component.configuration";
import {MatSort, Sort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {TableSortingService} from "../../services/table.sorting.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['table.component.scss']
})
export class GenericTableComponent implements OnInit {
  protected readonly PropertyType = PropertyType;
  @Input() isLoading: boolean = false;
  @Input() items: any[];
  @Input() dataSource: MatTableDataSource<TableItem>;
  @Input() displayedColumns: string[];
  @Input() tableConfiguration: TableConfiguration;
  @Input() getPlayerName: (playerId: string) => string;
  @Output() actionClicked = new EventEmitter<any>();

  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | null = null;

  constructor(private sortingService: TableSortingService) {}

  ngOnInit() {
    this.displayedColumns = this.tableConfiguration.properties
      .map(prop => prop.name);
    if (this.tableConfiguration.action) {
      this.displayedColumns.push('action');
    }
  }

  onSort(columnName: string) {
    if (this.sortColumn === columnName) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnName;
      this.sortDirection = 'asc';
    }
    this.sortingService.sortData(this.dataSource, this.sortColumn, this.sortDirection);
  }
}

