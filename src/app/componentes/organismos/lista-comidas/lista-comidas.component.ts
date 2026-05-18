import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDiarioComponent } from '../../moleculas/item-diario/item-diario.component'; // Verifica tu ruta

@Component({
  selector: 'app-lista-comidas',
  templateUrl: './lista-comidas.component.html',
  standalone: true,
  imports: [CommonModule, ItemDiarioComponent]
})
export class ListaComidasComponent {
  // Matriz reactiva de entrada que almacena los objetos de tipo alimento inyectados desde el LocalStorage
  @Input() comidas: any[] = [];
  
  // Flag de control que habilita o bloquea el renderizado de los botones de borrado en cascada
  @Input() mostrarBorrar: boolean = true; 
  
  // Evento de salida (@Output) que emite una cadena única con el identificador del ítem que se desea destruir
  @Output() onEliminarItem = new EventEmitter<string>();

  // Método que recibe el identificador único de la molécula secundaria y lo manda a la pagina principal
  eliminar(id: string) {
    // Lanza el ID hacia la capa superior encargada de mutar el LocalStorage y refrescar el estado de los macros
    this.onEliminarItem.emit(id); 
  }
}