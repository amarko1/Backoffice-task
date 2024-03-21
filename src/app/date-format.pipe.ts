import { Pipe, PipeTransform } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {formatDate} from "@angular/common";

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(value: any, ...args: any[]): any {
    console.log("Trenutni jezik:", this.translate.currentLang);
    const format = this.getLocaleFormat();
    return formatDate(value, format, this.translate.currentLang);
  }

  private getLocaleFormat() {
    const formats = {
      'en': 'MM/dd/yyyy, h:mm a',
      'hr': 'dd.MM.yyyy, HH:mm'
    };
    return formats[this.translate.currentLang] || 'dd/MM/yyyy, HH:mm';
  }

}
