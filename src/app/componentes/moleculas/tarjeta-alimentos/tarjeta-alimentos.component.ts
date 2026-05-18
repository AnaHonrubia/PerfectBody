import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { addCircle } from 'ionicons/icons';

@Component({
  selector: 'app-tarjeta-alimentos',
  templateUrl: './tarjeta-alimentos.component.html',
  styleUrls: ['./tarjeta-alimentos.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TarjetaAlimentosComponent {
  // Propiedades de entrada (@Input) mapeadas dinámicamente desde el bucle asíncrono de la base de datos de alimentos
  @Input() nombre: string = ''; // Nombre del alimento (ej: 'Arroz Integral')
  @Input() kcal: number = 0; // Densidad energética por porción estándar
  @Input() imagen: string = ''; // URL remota de la imagen alojada en la caché o servidor
  
  // Evento de salida (@Output) que notifica al diario de nutrición que este alimento específico ha sido seleccionado
  @Output() onAdd = new EventEmitter<void>();

  constructor() {
    // Inyección optimizada del icono de adición en el motor en memoria del framework
    addIcons({ addCircle });
  }
}