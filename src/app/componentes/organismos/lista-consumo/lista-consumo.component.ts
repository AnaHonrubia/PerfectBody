import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons'; 
import { trash } from 'ionicons/icons'; 

@Component({
  selector: 'app-lista-consumo',
  templateUrl: './lista-consumo.component.html',
  styleUrls: ['./lista-consumo.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule] 
})
export class ListaConsumoComponent {
  
  // Matriz reactiva de entrada que almacena los objetos de tipo alimento inyectados desde el LocalStorage
  @Input() comidas: any[] = [];
  
  // Evento de salida (@Output) que emite una cadena única con el identificador del alimento que se desea destruir
  @Output() onEliminar = new EventEmitter<string>();
  
  // Filtro de control UX: Indica qué bloque temporal se está renderizando (Desayuno, Almuerzo, Cena, Merienda)
  @Input() momentoActual: string = '';

  constructor() {
    // Inyección optimizada del icono de eliminación en el motor en memoria de Ionic
    addIcons({ trash });
  }

  // Método de calculo lógico en memoria
  contarComidasEn(momento: string): number {
    // Aplica una función flecha predictiva con la directiva filter de JavaScript en tiempo real
    return this.comidas.filter(c => c.momento === momento).length;
  }

}