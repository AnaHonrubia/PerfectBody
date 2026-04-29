import { Component, Output, EventEmitter } from '@angular/core';
import { IonSearchbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-buscador-ejercicios',
  templateUrl: './buscador-ejercicios.component.html',
  styleUrls: ['./buscador-ejercicios.component.scss'],
  standalone: true,
  imports: [IonSearchbar]
})

export class BuscadorEjerciciosComponent {
  @Output() onBusqueda = new EventEmitter<string>();

  alBuscar(event: any) {
    this.onBusqueda.emit(event.target.value);
  }
}