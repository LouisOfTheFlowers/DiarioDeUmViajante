// Importa os módulos necessários do Angular para criar um Pipe
import { Pipe, PipeTransform } from '@angular/core';

// Declara o Pipe com o nome 'filterDestinos'
@Pipe({
  name: 'filterDestinos',
  standalone: false,
})
// Define a classe do Pipe que implementa a interface PipeTransform
export class FilterDestinosPipe implements PipeTransform {
  // Função que transforma a lista de destinos de acordo com o termo de pesquisa
  transform(destinos: any[], searchTerm: string): any[] {
    // Se não houver termo de pesquisa, devolve todos os destinos
    if (!searchTerm) return destinos;
    // Filtra os destinos cujo título inclui o termo de pesquisa (case insensitive)
    return destinos.filter(destino =>
      destino.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}