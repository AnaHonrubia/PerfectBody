import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
         IonSegment, IonSegmentButton, IonLabel, IonGrid, IonRow,
         IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
         IonCardContent, IonButton, IonModal, IonList, IonItem, IonIcon, IonInput
 } from '@ionic/angular/standalone';
import { BotonOscuroComponent } from '../../componentes/atomos/boton-oscuro/boton-oscuro.component';
import { FitAtomic } from 'src/app/services/fit-atomic';

import { addIcons } from 'ionicons';
import { trashOutline, addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-entrenamiento',
  templateUrl: './entrenamiento.page.html',
  styleUrls: ['./entrenamiento.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    BotonOscuroComponent, IonButtons, IonSegment, IonSegmentButton, IonLabel, IonGrid,
    IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonButton, IonModal, IonList, IonItem, IonInput, IonIcon
  ]
})
export class EntrenamientoPage implements OnInit {
  ejercicios: any[] = [];
  ejerciciosFiltrados: any[] = [];
  grupoSeleccionado: string = 'Pecho'; // Grupo por defecto

  isModalOpen = false;
  ejercicioSeleccionado: any = null;

  seriesTemporales: any[] = []; // Se guarda las series antes de enviarlas al servicio

  constructor(private fitService: FitAtomic) {
    addIcons ({
      trashOutline, addOutline
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    // Se llama a getEjerciciosAsync
    const res = await this.fitService.getEjerciciosAsync(); 
    this.ejercicios = res;
    
    console.log('Ejercicios recibidos en página:', this.ejercicios.length);
    
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

  abrirModalEntreno(ejercicio: any) {
    console.log("Clic detectado para: ", ejercicio.nombre);
    this.ejercicioSeleccionado = ejercicio;
    // Se empieza con una serie vacía por defecto para que el usuario no vea el modal vacío
    this.seriesTemporales = [{ peso: null, repeticiones: null }]; 
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  // Se modifica el guardado para que mande los datos reales
  guardarEntreno() {
    // Se valida que haya al menos una serie con datos
    const seriesValidas = this.seriesTemporales.filter(s => s.peso > 0 && s.repeticiones > 0);

    if (seriesValidas.length === 0) {
      alert('Añade al menos una serie con peso y repeticiones.');
      return;
    }

    const datosFinales = {
      id: Date.now(),
      ejercicioId: this.ejercicioSeleccionado.id,
      nombre: this.ejercicioSeleccionado.nombre,
      series: seriesValidas,
      fecha: new Date().toLocaleDateString()
    };

    // LLama al servicio para guardar
    this.fitService.guardarSesionEntreno(datosFinales);
    
    // Cierra y feedback
    this.cerrarModal();
    console.log('¡Ejercicio registrado!');
  }

  agregarSerie() {
    this.seriesTemporales.push({ peso: null, repeticiones: null });
  }

  quitarSerie(index: number) {
    this.seriesTemporales.splice(index, 1);
  }
  
}
