import { Component, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selector-fecha',
  templateUrl: './selector-fecha.component.html',
  styleUrls: ['./selector-fecha.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})

export class SelectorFechaComponent {
  
  // Evento de salida (@Output) que emite un String con la fecha formateada en formato local cada vez que cambia el calendario
  @Output() fechaCambiante = new EventEmitter<string>();

  /**
   * Método controlador disparado de forma reactiva cuando el usuario confirma una nueva fecha en el ion-datetime.
   */
  onFechaCambiada(event: any) { 
    // Instanciamos un objeto Date de JavaScript pasándole la cadena ISO y lo formateamos a la configuración regional del smartphone (dd/mm/aaaa)
    const fecha = new Date(event.detail.value).toLocaleDateString();
    
    // Emitimos la fecha limpia y procesada hacia el componente padre para refrescar de forma inmediata los registros de ese día
    this.fechaCambiante.emit(fecha);
  }
}
