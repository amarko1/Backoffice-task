import {
  AfterViewInit,
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
export class GenericTableComponent implements OnInit, OnChanges,AfterViewInit  {
  protected readonly PropertyType = PropertyType;
  @Input() isLoading: boolean = false;
  @Input() items: any[];
  dataSource: MatTableDataSource<TableItem>;
  displayedColumns: string[];
  @Input() tableConfiguration: TableConfiguration;
  @Input() getPlayerName: (playerId: string) => string;
  @Output() actionClicked = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | null = null;

  constructor(private sortingService: TableSortingService, private cdRef: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.cdRef.detectChanges();
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
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnName;
      this.sortDirection = 'asc';
    }
    this.sortingService.sortData(this.dataSource, this.sortColumn, this.sortDirection);
  }
}

