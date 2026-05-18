import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-item-diario',
  templateUrl: './item-diario.component.html',
  styleUrls: ['./item-diario.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ItemDiarioComponent {
  // Atributos de entrada (@Input) inyectados dinámicamente desde el bucle repetitivo de la página padre
  @Input() nombre: string = ''; // Nombre del plato o alimento (ej: 'Tortitas de Avena')
  @Input() caloriasTotales: number = 0; // Valor numérico de la carga calórica del registro
  
  // Flag de control UX: Permite habilitar o deshabilitar la acción de borrado según el contexto de la vista
  @Input() puedeBorrar: boolean = true; 

  // Evento de salida (@Output) encargado de notificar al controlador principal que el usuario solicita la destrucción del registro
  @Output() onBorrar = new EventEmitter<void>();

  constructor(){
    // Registro explícito del icono de eliminación en el diccionario en memoria de Ionic
    addIcons({ trashOutline });
  }

  /**
   * Método disparado de forma reactiva al interactuar con el botón nativo de la papelera.
   * Emite el evento de borrado hacia arriba sin mutar el estado local directamente.
   */
  borrarItem() {
    this.onBorrar.emit(); // Lanza la notificación al padre para ejecutar la lógica de eliminación del LocalStorage
  }
}