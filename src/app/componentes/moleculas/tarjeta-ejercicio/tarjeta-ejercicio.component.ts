import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
  IonCardContent, IonButton 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tarjeta-ejercicio',
  templateUrl: './tarjeta-ejercicio.component.html',
  styleUrls: ['./tarjeta-ejercicio.component.scss'],
  standalone: true,
  imports: [
    CommonModule, IonCard, IonCardHeader, IonCardTitle, 
    IonCardSubtitle, IonCardContent, IonButton
  ]
})

export class TarjetaEjercicioComponent {
  
  // Atributo de entrada que recibe todos los atributos del ejercicio
  @Input() ejercicio: any;

  // Evento de salida encargado de modificar al controlador principal
  @Output() configurarSeries = new EventEmitter<any>();

  // Método disparado de forma reactiva al interactuar con el control de configuración
  emitirConfiguracion() {
    // Emite el objeto con toda la metadata del movimiento seleccionado
    this.configurarSeries.emit(this.ejercicio);
  }
}
