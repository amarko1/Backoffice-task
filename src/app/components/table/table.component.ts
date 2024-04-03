
import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PropertyType, TableConfiguration, TableItem} from "../configuration/table.component.configuration";
import {MatSort, Sort} from "@angular/material/sort";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['table.component.scss']
})
export class GenericTableComponent implements OnInit, AfterViewInit {
  protected readonly PropertyType = PropertyType;
  @Input() isLoading: boolean = false;
  @Input() items: any[];
  @Input() dataSource: MatTableDataSource<TableItem>;
  @Input() tableConfiguration: TableConfiguration;
  @Input() getPlayerName: (playerId: string) => string;
  @Input() displayedColumns: string[];
  @Output() actionClicked = new EventEmitter<any>();
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
  }
  ngOnInit() {
    this.displayedColumns = this.tableConfiguration.properties
      .map(prop => prop.name);
    if (this.tableConfiguration.action) {
      this.displayedColumns.push('action');
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
