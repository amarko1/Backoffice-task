import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PropertyType, TableConfiguration, TableItem} from "../configuration/table.component.configuration";
import {TableSortingService} from "../../services/table.sorting.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['table.component.scss']
})
export class GenericTableComponent implements OnInit, OnChanges  {
  protected readonly PropertyType = PropertyType;
  @Input() isLoading: boolean = false;
  @Input() items: any[];
  dataSource: MatTableDataSource<TableItem>;
  displayedColumns: string[];
  @Input() tableConfiguration: TableConfiguration;
  @Input() getPlayerName: (playerId: string) => string;
  @Output() actionClicked = new EventEmitter<any>();

  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | null = null;

  constructor(private sortingService: TableSortingService, private cdRef: ChangeDetectorRef) {
  }

  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.initializeDataSource();
    this.setupDisplayedColumns();
    this.processItems();
  }

  initializeDataSource() {
    this.dataSource = new MatTableDataSource<TableItem>([]);
  }

  setupDisplayedColumns() {
    this.displayedColumns = this.tableConfiguration.properties.map(prop => prop.suffix);
    if (this.tableConfiguration.action) {
      this.displayedColumns.push('action');
    }
  }

  processItems() {
    console.log('Processing items...');
    if (!this.items || this.items.length === 0) {
      console.log('No items to process.');
      return;
    }

    if (this.dataSource) {
      this.dataSource.data = this.items.map(item => {
        let processedItem = {};
        this.tableConfiguration.properties.forEach(prop => {
          processedItem[prop.suffix] = item[prop.suffix];
        });
        return new TableItem(processedItem);
      });
    }
    console.log('Processed items:', this.dataSource.data);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["items"] && this.items) {
      this.processItems();
    }
  }


  onSort(columnName: string) {
    if (this.sortColumn === columnName) {
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        this.sortDirection = null;
        this.sortColumn = null;
      }
    } else {
      this.sortColumn = columnName;
      this.sortDirection = 'asc';
    }

    if (this.sortDirection) {
      this.sortingService.sortData(this.dataSource, this.sortColumn, this.sortDirection);
    }
  }
}

