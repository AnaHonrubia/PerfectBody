import { Component, Output, EventEmitter, Input } from '@angular/core';
import { IonSearchbar, IonToolbar, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buscador-ejercicio',
  templateUrl: './buscador-ejercicio.component.html',
  styleUrls: ['./buscador-ejercicio.component.scss'],
  standalone: true,
  imports: [IonSearchbar, IonToolbar, IonSegment, IonSegmentButton, IonLabel, CommonModule]
})
export class BuscadorEjercicioComponent {
  // Recibe del padre el grupo por defecto para inicializar la interfaz coordinada
  @Input() grupoActivo: string = 'Pecho';
  
  // Evento compuesto de salida que emite un objeto clave-valor con los dos criterios de filtrado simultáneos
  @Output() onFiltroCambio = new EventEmitter<{texto: string, grupo: string}>();

  // Variables privadas encargadas de almacenar el estado interno de la búsqueda actual
  private textoBusqueda: string = '';
  private grupoSeleccionado: string = 'Pecho';

  // Captura el flujo de caracteres de la barra de texto. 
  alBuscar(event: any) {
    this.textoBusqueda = event.target.value.toLowerCase();
    this.emitir(); // Dispara la actualización reactiva hacia la página principal
  }

  //  Captura el evento del selector de segmentos al pulsar sobre una categoría anatómica diferente.
  cambiarGrupo(event: any) {
    this.grupoSeleccionado = event.detail.value;
    this.emitir(); // Sincroniza el cambio en el árbol de componentes
  }

  // Método centralizado de emisión. Empaqueta el texto y el grupo muscular activo y los lanza en un único evento unificado hacia el componente padre.
  private emitir() {
    this.onFiltroCambio.emit({
      texto: this.textoBusqueda,
      grupo: this.grupoSeleccionado
    });
  }
}