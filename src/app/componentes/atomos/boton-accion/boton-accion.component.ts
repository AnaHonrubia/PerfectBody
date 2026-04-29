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

  @Input() texto: string = '';
  @Output() clickBoton = new EventEmitter<void>();
  
}