import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
         IonSegment, IonSegmentButton, IonLabel, IonGrid, IonRow,
         IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
         IonCardContent, IonButton, IonModal
 } from '@ionic/angular/standalone';
import { BotonOscuroComponent } from '../../componentes/atomos/boton-oscuro/boton-oscuro.component';
import { FitAtomic } from 'src/app/services/fit-atomic';

@Component({
  selector: 'app-entrenamiento',
  templateUrl: './entrenamiento.page.html',
  styleUrls: ['./entrenamiento.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    BotonOscuroComponent, IonButtons, IonSegment, IonSegmentButton, IonLabel, IonGrid,
    IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonButton, IonModal
  ]
})
export class EntrenamientoPage implements OnInit {
  ejercicios: any[] = [];
  ejerciciosFiltrados: any[] = [];
  grupoSeleccionado: string = 'Pecho'; // Grupo por defecto

  isModalOpen = false;
  ejercicioSeleccionado: any = null;

  constructor(private fitService: FitAtomic) {}

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.ejercicios = await this.fitService.getEjercicios();
    this.filtrarPorGrupo();
  }

  cambiarGrupo(event: any) {
    this.grupoSeleccionado = event.detail.value;
    this.filtrarPorGrupo();
  }

  filtrarPorGrupo() {
    this.ejerciciosFiltrados = this.ejercicios.filter(
      ej => ej.grupo === this.grupoSeleccionado
    );
  }

  // Modifica la función que creamos ayer
  abrirModalEntreno(ejercicio: any) {
    this.ejercicioSeleccionado = ejercicio;
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  guardarEntreno() {
    // Aquí conectaremos con el servicio FitAtomic
    console.log('Guardando series de:', this.ejercicioSeleccionado.nombre);
    this.cerrarModal();
  }

  
  
}
