import { Component, Output, EventEmitter, Input } from '@angular/core';
import { IonSearchbar, IonToolbar, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buscador-ejercicios',
  templateUrl: './buscador-ejercicios.component.html',
  styleUrls: ['./buscador-ejercicios.component.scss'],
  standalone: true,
  imports: [IonSearchbar, IonToolbar, IonSegment, IonSegmentButton, IonLabel, CommonModule]
})
export class BuscadorEjerciciosComponent {
  @Input() grupoActivo: string = 'Pecho';
  @Output() onFiltroCambio = new EventEmitter<{texto: string, grupo: string}>();

  private textoBusqueda: string = '';
  private grupoSeleccionado: string = 'Pecho';

  // Al escribir en la barra
  alBuscar(event: any) {
    this.textoBusqueda = event.target.value.toLowerCase();
    this.emitir();
  }

  // Al pulsar un botón del segmento
  cambiarGrupo(event: any) {
    this.grupoSeleccionado = event.detail.value;
    this.emitir();
  }

  private emitir() {
    this.onFiltroCambio.emit({
      texto: this.textoBusqueda,
      grupo: this.grupoSeleccionado
    });
  }
}