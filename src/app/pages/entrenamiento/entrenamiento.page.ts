import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Importaciones atómicas de Ionic Standalone para maximizar la velocidad de respuesta táctil en smartphones
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
         IonSegment, IonSegmentButton, IonLabel, IonGrid, IonRow,
         IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
         IonCardContent, IonButton, IonModal, IonList, IonItem, IonIcon, IonInput
} from '@ionic/angular/standalone';

// Inyección de componentes atómicos, moleculares y organismos personalizados de tu arquitectura
import { BotonOscuroComponent } from '../../componentes/atomos/boton-oscuro/boton-oscuro.component';
import { FitAtomic } from 'src/app/services/fit-atomic';
import { TarjetaEjercicioComponent } from 'src/app/componentes/moleculas/tarjeta-ejercicio/tarjeta-ejercicio.component';
import { ListaEntrenosHoyComponent } from 'src/app/componentes/organismos/lista-entrenos-hoy/lista-entrenos-hoy.component';
import { CronometroComponent } from 'src/app/componentes/atomos/cronometro/cronometro.component';
import { BuscadorEjercicioComponent } from 'src/app/componentes/moleculas/buscador-ejercicio/buscador-ejercicio.component';

import { addIcons } from 'ionicons';
import { trashOutline, addOutline } from 'ionicons/icons'; // Assets vectoriales requeridos por el modal

@Component({
  selector: 'app-entrenamiento', // Selector único de la vista de gimnasio
  templateUrl: './entrenamiento.page.html', // Vinculación estructural
  styleUrls: ['./entrenamiento.page.scss'], // Vinculación de estilos locales encapsulados
  standalone: true, // Arquitectura Standalone estricta libre de herencias de módulos globales tradicionales
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    BotonOscuroComponent, IonButtons, IonSegment, IonSegmentButton, IonLabel, IonGrid,
    IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonButton, IonModal, IonList, IonItem, IonInput, IonIcon, TarjetaEjercicioComponent,
    ListaEntrenosHoyComponent, CronometroComponent, BuscadorEjercicioComponent
  ]
})
export class EntrenamientoPage implements OnInit {
  // Colecciones de estado global para controlar el catálogo general de musculación
  ejercicios: any[] = []; // Base de datos estática completa traída del repositorio asíncrono
  ejerciciosFiltrados: any[] = []; // Array volátil reactivo que se dibuja directamente en la interfaz
  grupoSeleccionado: string = 'Pecho'; // Criterio de aislamiento muscular inicial por defecto

  // Flags y objetos de control para la gestión de estados transaccionales (Modales de marca)
  isModalOpen = false;
  ejercicioSeleccionado: any = null; // Almacena la metadata del movimiento activo (ej: 'Sentadillas')

  // Buffer transaccional temporal. Retiene las series añadidas por el usuario en memoria volátil antes de guardarlas definitivamente
  seriesTemporales: any[] = []; 

  @ViewChild('listaHoy') listaHoy!: ListaEntrenosHoyComponent;

  constructor(private fitService: FitAtomic) {
    // Registro de vectores de interfaz en el motor caché de Ionic
    addIcons ({
      trashOutline, addOutline
    });
  }

  // Dispara el hilo de red asíncrono para descargar el JSON de ejercicios.
  ngOnInit() {
    this.cargarDatos();
  }

  // Método encargado de consumir la API remota o persistencia simulada a través de promesas.
  async cargarDatos() {
    // Suspende de forma no bloqueante la ejecución local usando 'await' hasta que la promesa del servicio se resuelva con éxito
    const res = await this.fitService.getEjerciciosAsync(); 
    this.ejercicios = res;
    
    console.log('Ejercicios recibidos en página:', this.ejercicios.length);
    
    // Fuerza la segmentación inicial por el grupo por defecto para pintar la pantalla de inicio
    this.filtrarPorGrupo();
  }

  // Metodo que actualiza el estado del filtro e invoca la criba de datos.
  cambiarGrupo(event: any) {
    this.grupoSeleccionado = event.detail.value;
    this.filtrarPorGrupo();
  }

  // Algoritmo de filtrado simple por grupo muscular en memoria local.
  filtrarPorGrupo() {
    this.ejerciciosFiltrados = this.ejercicios.filter(
      ej => ej.grupo === this.grupoSeleccionado
    );
  }

  abrirModalEntreno(ejercicio: any) {
    console.log("Clic detectado para: ", ejercicio.nombre);
    this.ejercicioSeleccionado = ejercicio;
    
    this.seriesTemporales = [{ peso: null, repeticiones: null }]; 
    this.isModalOpen = true; // Activa el renderizado del modal en el árbol del DOM
  }

  // Resetea el flag de visibilidad del modal.
  cerrarModal() {
    this.isModalOpen = false;
  }

  /**
   * Método transaccional central. Valida, 
   * y los envía al LocalStorage para salvar el entrenamiento de la sesión de hoy.
   */
  // Método que  empaqueta de forma estructurada los datos del ejercicio
  guardarEntreno() {
    // FILTRADO DE SEGURIDAD ANALÍTICO: Elimina del buffer cualquier serie incompleta o con valores negativos
    const seriesValidas = this.seriesTemporales.filter(s => s.peso > 0 && s.repeticiones > 0);

    // Si tras el filtrado estricto la longitud es cero, interrumpe el flujo y avisa al usuario mediante feedback reactivo
    if (seriesValidas.length === 0) {
      alert('Añade al menos una serie con peso y repeticiones.');
      return;
    }

    // Estructuración del objeto final indexado listo para persistencia masiva
    const datosFinales = {
      id: Date.now(), // Generación de clave primaria unívoca basada en marca de tiempo UNIX
      ejercicioId: this.ejercicioSeleccionado.id,
      nombre: this.ejercicioSeleccionado.nombre,
      series: seriesValidas, // Volcado de las series limpias validadas
      fecha: new Date().toLocaleDateString() // Vinculación cronológica (dd/mm/aaaa) para mapeo directo
    };

    // Invoca el método público del servicio inyectado para mutar físicamente el LocalStorage
    this.fitService.guardarSesionEntreno(datosFinales);
  
    /**
     * OPERACIÓN ACOPLADA REACTIVA: Rompe el encapsulamiento a través de la referencia @ViewChild 
     * e indica forzosamente al organismo inferior que vuelva a leer el historial de hoy,
     * consiguiendo un efecto espejo de actualización inmediata en la pantalla.
     */
    this.listaHoy.cargarEntrenos(); 
    this.cerrarModal(); // Cierre automático del flujo transaccional
  }

  /**
   * Añade un nuevo par ordenado vacío al buffer transaccional para expandir la rejilla de entradas del modal.
   */
  agregarSerie() {
    this.seriesTemporales.push({ peso: null, repeticiones: null });
  }

  /**
   * Elimina una serie del buffer temporal basándose en su índice posicional de la lista utilizando mutación directa de arrays.
   * @param index Índice entero del bucle de la vista
   */
  quitarSerie(index: number) {
    this.seriesTemporales.splice(index, 1);
  }

  /**
   * Algoritmo de filtrado combinatorio avanzado. Criba la colección de ejercicios evaluando
   * de forma simultánea tanto la categoría del músculo como el patrón tipográfico de búsqueda (Regex/Includes).
   * @param event Objeto estructurado emitido por la molécula de búsqueda superior
   */
  aplicarFiltrosGlobales(event: {texto: string, grupo: string}) {
    this.grupoSeleccionado = event.grupo; // Sincroniza el estado del grupo
    
    // Ejecuta una operación de intersección lógica (AND lógico) en memoria central
    this.ejerciciosFiltrados = this.ejercicios.filter(ej => {
      const coincideGrupo = ej.grupo === event.grupo;
      const coincideTexto = ej.nombre.toLowerCase().includes(event.texto);
      return coincideGrupo && coincideTexto; // Ambos criterios deben evaluarse verdaderos para pasar la criba
    });
  }
  
}