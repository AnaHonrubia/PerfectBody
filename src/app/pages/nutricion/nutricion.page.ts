import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FitAtomic } from '../../services/fit-atomic';
import { ResumenNutricionalComponent } from '../../componentes/organismos/resumen-nutricional/resumen-nutricional.component';
import { TarjetaAlimentosComponent } from '../../componentes/moleculas/tarjeta-alimentos/tarjeta-alimentos.component';
import { SelectorFechaComponent } from '../../componentes/moleculas/selector-fecha/selector-fecha.component';
import { ListaConsumoComponent } from '../../componentes/organismos/lista-consumo/lista-consumo.component';
import { BotonOscuroComponent } from 'src/app/componentes/atomos/boton-oscuro/boton-oscuro.component';

import { addIcons } from 'ionicons';
import { listOutline } from 'ionicons/icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nutricion',
  templateUrl: './nutricion.page.html',
  styleUrls: ['./nutricion.page.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [IonicModule, CommonModule, ResumenNutricionalComponent, TarjetaAlimentosComponent, 
    ListaConsumoComponent, SelectorFechaComponent, BotonOscuroComponent, RouterModule]
})

export class NutricionPage {
  // Atributos de estado y colecciones reactivas de la página de alimentación
  alimentos: any[] = []; // Base de datos general de alimentos cargada asíncronamente (catálogo)
  comidasDelDia: any[] = []; // Alimentos consumidos reales que se pintarán en la lista del momento seleccionado
  fechaSeleccionada: string = new Date().toLocaleDateString(); // Estado de control cronológico inicializado a la fecha de hoy (dd/mm/aaaa)
  totales = { kcal: 0, protes: 0, carbos: 0, grasas: 0 }; // Estructura acumuladora reactiva para el panel analítico superior
  objetivoDiario: number = 0; // Meta calórica calculada por la ecuación de Harris-Benedict

  esHoy: boolean = true; // Flag estratégico de UX para habilitar la inserción o bloquear la edición en históricos pasados
  momentoActual: string = 'Desayuno'; // Segmento temporal activo por defecto para la categorización de ingestas

  constructor(private fitService: FitAtomic) {
    // Registro de vectores gráficos requeridos por la iconografía de control en el motor caché de Ionic
    addIcons({ listOutline });
  }

  async ngOnInit() {
    console.log('Iniciando carga de nutrición...');
    
    // Recupera de forma síncrona inmediata el objetivo calórico almacenado en la persistencia local
    this.objetivoDiario = this.fitService.getObjetivoKcal();
    
    // Bloque Try-Catch para mitigar pérdidas de conectividad al llamar al repositorio externo de GitHub
    try {
      // Espera de forma no bloqueante mediante la promesa asíncrona la descarga completa del JSON de alimentos
      const res = await this.fitService.getAlimentosAsync();
      if (res) {
        this.alimentos = res; // Carga en memoria del catálogo remoto oficial
        console.log('Alimentos cargados con éxito:', this.alimentos.length);
      }
    } catch (error) {
      console.error('Error al cargar alimentos:', error);
      // MECANISMO DE RESILIENCIA (FALLBACK): Si falla internet, consume la base de datos local estática de seguridad
      this.alimentos = this.fitService.getAlimentos(); 
    }

    // Fuerza la renderización síncrona de los bloques de comida y cálculos metabólicos
    this.actualizarVista();
  }

  // Manejador de forma reactiva al interactuar con el componente de control de fechas.
  cambiarFecha(nuevaFecha: string) {
    this.fechaSeleccionada = nuevaFecha; // Sincroniza el estado cronológico central
    console.log('Cambiando a fecha:', this.fechaSeleccionada);
    this.actualizarVista(); // Redibuja el listado completo filtrando por el nuevo día
  }

  // Método encargado de insertar un alimento en el diario del atleta.
  agregarComida(alimento: any, momento: string) {
    // CLÁUSULA DE GUARDA (INTEGRIDAD DE DATOS): Impide añadir ingestas de comida en fechas anteriores a hoy
    if (!this.esHoy) {
      console.warn('No puedes añadir comida en días pasados');
      return; // Interrumpe y expulsa el flujo de ejecución inmediatamente
    }

    // Adaptación transaccional: Sincroniza nombres de atributos variables de la API externa a la nomenclatura estricta local de la App
    const nuevaEntrada = {
      id: Date.now().toString(), // Generación de ID único mediante marca de tiempo UNIX stringificada
      nombre: alimento.nombre,
      imagen: alimento.imagen,
      kcal: alimento.kcal || alimento.calorias || 0, // Fallback binario para capturar la energía
      protes: alimento.protes || alimento.proteinas || 0, // Mapeo de macronutriente proteico
      carbos: alimento.carbos || alimento.carbohidratos || 0, // Mapeo de hidratos de carbono
      grasas: alimento.grasas || 0,
      momento: momento 
    };

    // Vuelca de forma persistente la nueva fila en el LocalStorage a través de la firma del servicio
    this.fitService.agregarAlDiario(nuevaEntrada, this.fechaSeleccionada);
    
    // Fuerza el refresco mecánico del estado visual para pintar el nuevo alimento y recalcular las barras de progreso
    this.actualizarVista();
  }

  // Envía una solicitud de destrucción de registro al servicio pasándole su identificador primario.
  eliminarComida(id: string) {
    this.fitService.eliminarComida(id, this.fechaSeleccionada); // Elimina de forma directa el registro físico en la persistencia local
    
    this.actualizarVista(); // Actualiza el muelle elástico de datos reflejando el cambio de inmediato en la pantalla
    console.log('Alimento eliminado:', id);
  }

  // Método centralizador de sincronización visual. 
  actualizarVista() {
    // Extrae la totalidad de los consumos registrados en la clave de la fecha seleccionada
    const todasDelDia = this.fitService.getDiarioPorFecha(this.fechaSeleccionada);

    // Filtra en memoria volátil de forma estricta las comidas que coinciden exclusivamente con el bloque temporal activo (ej: 'Cena')
    this.comidasDelDia = todasDelDia.filter(c =>
      c.momento === this.momentoActual
    );

    // Actualiza de forma asíncrona reactiva los sumatorios globales y recupera metas por si han variado en el Perfil
    this.totales = this.fitService.getTotalesPorFecha(this.fechaSeleccionada);
    this.objetivoDiario = this.fitService.getObjetivoKcal();

    // LÓGICA DE CONTROL DE EDICIÓN: Compara dinámicamente si el string de la cabecera coincide milimétricamente con el día actual físico
    const hoyStr = new Date().toLocaleDateString();
    
    // El resultado booleano habilita el renderizado de los botones de adición de alimentos (*ngIf="esHoy")
    this.esHoy = (this.fechaSeleccionada === hoyStr);
  }

  /**
   * Captura el evento lanzado por el selector de barras de herramientas de Ionic (Segment bar).
   * @param event Objeto nativo de interacción que contiene el valor textual del segmento pulsado
   */

  cambiarMomento(event: any) {
    this.momentoActual = event.detail.value; // Actualiza la variable de control del bloque temporal activo
    this.actualizarVista(); // Filtra la rejilla inferior de consumo según el nuevo momento
  }

  // Función que determina con precisión matemática si el usuario cumple los requisitos rígidos para compilar la semana.
  puedeCerrarSemana(): boolean {
    const hoy = new Date();
    const esDomingo = hoy.getDay() === 0; // Evaluación estricta de calendario: 0 representa el domingo en el constructor Date nativo
    
    // Evalúa si en el array de ingestas filtradas del día existe al menos un registro en el bloque 'Cena'
    const tieneCena = this.comidasDelDia.some(c => c.momento === 'Cena');

    // Triple validación lógica (AND): Solo es verdadero si es domingo de calendario, se encuentra visualizando el día de hoy, y ha anotado la cena
    return esDomingo && this.esHoy && tieneCena;
  }

  // Función que recorre los últimos 7 días, realiza sumatorios de marcas y guarda la instantánea en el histórico.
  cerrarSemanaManual() {
    // Inicialización del acumulador estructural de macros semanales
    const resumenSemanal = { kcal: 0, protes: 0, grasas: 0, carbos: 0 };
    const hoy = new Date();

    // Bucle indexado iterativo decreciente: Ejecuta 7 consultas consecutivas síncronas hacia el LocalStorage
    for (let i = 0; i < 7; i++) {
      const fecha = new Date();
      // Aplica aritmética de fechas restando el índice 'i' días hacia el pasado para reconstruir la semana completa
      fecha.setDate(hoy.getDate() - i);
      const fechaStr = fecha.toLocaleDateString(); // Conversión a string para utilizarla como clave de búsqueda indexada
      
      // Recupera de forma directa los totales de ese día específico y los suma a los contadores acumulativos
      const totalesDia = this.fitService.getTotalesPorFecha(fechaStr);
      resumenSemanal.kcal += totalesDia.kcal;
      resumenSemanal.protes += totalesDia.protes;
      resumenSemanal.grasas += totalesDia.grasas;
      resumenSemanal.carbos += totalesDia.carbos;
    }

    // Despacha el objeto JSON cerrado definitivo hacia la persistencia a largo plazo para alimentar la gráfica de Chart.js
    this.fitService.guardarCierreSemanal(resumenSemanal);
    alert('¡Semana cerrada con éxito! Ya puedes verla en tu historial.');
  }

}