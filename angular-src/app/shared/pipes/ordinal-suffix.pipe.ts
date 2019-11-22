import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ordinal'
})
export class OrdinalSuffixPipe implements PipeTransform {

    transform(value: number): string {
        return value+(~~(value/10)%10==1?'th':[,'st','nd','rd'][value%10]||'th');
    }
}