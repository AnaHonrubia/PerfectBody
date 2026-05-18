import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FitAtomic } from 'src/app/services/fit-atomic';

import { 
  IonList, IonListHeader, IonLabel, IonItem, IonIcon,
  IonButton, IonButtons 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-lista-entrenos-hoy',
  templateUrl: './lista-entrenos-hoy.component.html',
  styleUrls: ['./lista-entrenos-hoy.component.scss'],
  standalone: true,
  imports: [CommonModule, IonList, IonListHeader, IonLabel, IonItem, IonIcon,
            IonButton, IonButtons
  ]
})

export class ListaEntrenosHoyComponent implements OnInit {
  // Matriz local reactiva que almacena las sesiones de entrenamiento completadas por el usuario hoy
  entrenosHoy: any[] = [];
  
  // Captura la estampa cronológica actual en formato string regional (dd/mm/aaaa) para usarla como clave de búsqueda
  fechaHoy: string = new Date().toLocaleDateString();

  constructor(private fitService: FitAtomic) {
    // Registro explícito de iconos en el motor nativo de Ionic para optimizar los buffers de memoria gráfica
    addIcons ({
      checkmarkCircle, trashOutline
    });
  }

  /**
   * Ciclo de vida inicial. Dispara de forma síncrona la lectura de marcas deportivas del LocalStorage en el arranque.
   */
  ngOnInit() {
    this.cargarEntrenos();
  }

  // Conecta con el servicio global para extraer el mapa completo de sesiones
  cargarEntrenos() {
    // Extraemos la colección completa en formato clave:valor (donde cada clave es una fecha)
    const historial = this.fitService.getHistorialEntrenos(); 
    
    // Si la fecha de hoy tiene registros los asigna, si no, inicializa un array vacío para evitar roturas de tipo null
    this.entrenosHoy = historial[this.fechaHoy] || [];
  }

  // Solicita al servicio la eliminación de una serie de ejercicio basándose en su ID único
  eliminar(id: number) {
    // Delegamos la mutación física del LocalStorage en el servicio inyectado
    this.fitService.eliminarEntreno(id, this.fechaHoy);
    
    // Efecto espejo reactivo: Sincroniza la vista local tras la destrucción del dato en la persistencia
    this.cargarEntrenos(); 
  }
}
