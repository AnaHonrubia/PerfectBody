import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-input-dato',
  template: `
    <ion-item>
      <ion-label position="floating">{{ etiqueta }}</ion-label>
      <ion-input 
        [type]="tipo" 
        [(ngModel)]="valor" 
        (ionChange)="valorChange.emit(valor)">
      </ion-input>
    </ion-item>
  `,
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class InputDatoComponent {
  @Input() etiqueta: string = '';
  @Input() tipo: string = 'text';
  @Input() valor: any;
  @Output() valorChange = new EventEmitter<any>(); // Esto permite el [(valor)]
}