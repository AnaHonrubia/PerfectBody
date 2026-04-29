import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-lista-consumo',
  templateUrl: './lista-consumo.component.html',
  styleUrls: ['./lista-consumo.component.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule ]
})
export class ListaConsumoComponent  {

  // Declarar que recibe la lista
  @Input() comidas: any[] = [];
  
  // Declarar el evento de eliminar
  @Output() onEliminar = new EventEmitter<string>();

  constructor() {}
}
