import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-boton-accion',
  template: `
    <ion-button expand="block" (click)="clickBoton.emit()" color="success">
      {{ texto }}
    </ion-button>
  `,
  standalone: true,
  imports: [IonicModule]
})
export class BotonAccionComponent {

  // Propiedad de entrada para recibir el texto desde el componente padre
  @Input() texto: string = '';
  // Propiedad de salida para notificar al padre cuando el usuario interactua con el botón
  @Output() clickBoton = new EventEmitter<void>();
  
}