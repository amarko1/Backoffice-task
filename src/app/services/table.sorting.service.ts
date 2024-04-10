import {Injectable} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {TableItem} from "../components/configuration/table.component.configuration";
import {PlayerService} from "./player.service";

@Injectable({ providedIn: 'root' })
export class TableSortingService {

  playerNameMap: Map<string, string> = new Map();

  constructor(private playerService: PlayerService) {
    this.fetchPlayerNames();
  }

  private fetchPlayerNames(): void {
    this.playerService.getPlayers().subscribe(players => {
      players.forEach(player => {
        this.playerNameMap.set(player.id, player.firstName);
      });
    });
  }

  sortData(dataSource: MatTableDataSource<TableItem>, sortColumn: string, sortDirection: 'asc' | 'desc') {
    const data = [...dataSource.data];
    data.sort((a, b) => this.compare(a, b, sortColumn, sortDirection));
    dataSource.data = data;
  }

  private compare(a: TableItem, b: TableItem, sortColumn: string, sortDirection: 'asc' | 'desc') {
    let valueA = this.getPropertyValue(a, sortColumn);
    let valueB = this.getPropertyValue(b, sortColumn);

    if (sortColumn === 'playerId') {
      valueA = this.playerNameMap.get(valueA) || valueA;
      valueB = this.playerNameMap.get(valueB) || valueB;
    }
    else {
      if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
        valueA = Number(valueA);
        valueB = Number(valueB);
      }
    }

    const isAsc = sortDirection === 'asc';
    return (valueA < valueB ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private getPropertyValue(item: TableItem, propertyName: string): any {
    if (item[propertyName] !== undefined) {
      return item[propertyName];
    }

    if (item.data && item.data[propertyName] !== undefined) {
      return item.data[propertyName];
    }

    console.error(`Property ${propertyName} is not found in`, item);
    return undefined;
  }
}
