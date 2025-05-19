import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDestinos',
  standalone:false,
})
export class FilterDestinosPipe implements PipeTransform {
  transform(destinos: any[], searchTerm: string): any[] {
    if (!searchTerm) return destinos;
    return destinos.filter(destino =>
      destino.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}