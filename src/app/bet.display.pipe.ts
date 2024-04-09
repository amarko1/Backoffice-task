import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'betDisplayPipe'
})
export class BetDisplayPipe implements PipeTransform {
  transform(bet: any): string {
    return `${bet.participants.join(' vs ')} odds: ${bet.odds}`;
  }
}
