
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {PropertyType, TableConfiguration, TableItem} from "../configuration/table.component.configuration";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['table.component.scss']
})
export class GenericTableComponent implements OnInit {
  @Input() isLoading: boolean = false;
  @Input() dataSource: MatTableDataSource<TableItem>;
  @Input() tableConfiguration: TableConfiguration;
  @Input() getPlayerName: (playerId: string) => string;
  @Input() displayedColumns: string[];
  @Input() columnMap: { [key: string]: string };
  @Output() actionClicked = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.displayedColumns = this.tableConfiguration.properties
      .map(prop => prop.name);
    if (this.tableConfiguration.action) {
      this.displayedColumns.push('action');
    }
  }


  protected readonly PropertyType = PropertyType;
}
