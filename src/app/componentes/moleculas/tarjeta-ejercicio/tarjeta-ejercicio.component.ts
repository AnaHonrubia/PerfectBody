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
  // Recibe los datos del ejercicio desde el padre (entrenamiento.page)
  @Input() ejercicio: any;

  // Avisa al padre para que abra el modal
  @Output() configurarSeries = new EventEmitter<any>();

  emitirConfiguracion() {
    this.configurarSeries.emit(this.ejercicio);
  }
}
