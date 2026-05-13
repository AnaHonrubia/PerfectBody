import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-dato',
  templateUrl: './input-dato.component.html', // Usamos el archivo externo
  styleUrls: ['./input-dato.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class InputDatoComponent {
  @Input() etiqueta: string = '';
  @Input() tipo: string = 'number';
  @Input() placeholder: string = '';
  @Input() unidad: string = '';
  @Input() valor: any;
  
  @Output() valorChange = new EventEmitter<any>();

  // Esta función sincroniza el cambio hacia el padre
  alCambiarValor(event: any) {
    this.valorChange.emit(this.valor);
  }
}