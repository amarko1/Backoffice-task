import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DateFormatPipe} from "../date-format.pipe";
import {GenericTableComponent} from "../components/table/table.component";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {TranslateModule} from "@ngx-translate/core";



@NgModule({
  declarations: [DateFormatPipe, GenericTableComponent],
  imports: [CommonModule, MatTableModule, MatSortModule, TranslateModule],
  exports: [DateFormatPipe, GenericTableComponent]
})
export class SharedModuleModule { }
