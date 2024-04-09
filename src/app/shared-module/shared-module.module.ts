import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DateFormatPipe} from "../date-format.pipe";
import {GenericTableComponent} from "../components/table/table.component";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {TranslateModule} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {BetDisplayPipe} from "../bet.display.pipe";



@NgModule({
  declarations: [DateFormatPipe, GenericTableComponent, BetDisplayPipe],
  imports: [CommonModule, MatTableModule, MatSortModule, TranslateModule, MatIconModule, MatPaginatorModule],
  exports: [DateFormatPipe, GenericTableComponent, BetDisplayPipe]
})
export class SharedModuleModule { }
