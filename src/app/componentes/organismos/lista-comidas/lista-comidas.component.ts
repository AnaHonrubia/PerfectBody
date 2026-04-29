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
  @Input() comidas: any[] = [];
  @Input() mostrarBorrar: boolean = true; // Permiso que viene de la página
  @Output() onEliminarItem = new EventEmitter<string>();

  eliminar(id: string) {
    this.onEliminarItem.emit(id); // LLamamos el ID hacia la página
  }
}