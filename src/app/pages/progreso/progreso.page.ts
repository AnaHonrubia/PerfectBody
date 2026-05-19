import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { FitAtomic } from 'src/app/services/fit-atomic';
import { BotonOscuroComponent } from '../../componentes/atomos/boton-oscuro/boton-oscuro.component';

Chart.register(...registerables);

@Component({
  selector: 'app-progreso',
  templateUrl: './progreso.page.html',
  styleUrls: ['./progreso.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, BotonOscuroComponent]
})
export class ProgresoPage implements OnInit, AfterViewInit {

  /**
   * DIRECTIVAS @ViewChild: Capturan las referencias nativas de los lienzos canvas `#chartPeso` y `#chartCalorias` del HTML.
   * El tipo ElementRef es indispensable para poder interactuar directamente con el contexto gráfico 2D del navegador.
   */
  @ViewChild('chartPeso') chartPeso!: ElementRef;
  @ViewChild('chartCalorias') chartCalorias!: ElementRef;

  constructor(private fitService: FitAtomic) {}

  // Ciclo de inicialización por defecto de Angular
  ngOnInit() {}

  ionViewWillEnter() {
    // Control de seguridad: Solo intenta dibujar si las referencias del DOM ya están instanciadas y mapeadas en memoria
    if (this.chartPeso && this.chartCalorias) {
      this.generarGraficaPeso();
      this.generarGraficaCalorias();
    }
  }

  ngAfterViewInit() {
    this.generarGraficaPeso();
    this.generarGraficaCalorias();
  }

  // Algoritmo encargado de procesar y renderizar la gráfica lineal de fluctuación de peso corporal.
  generarGraficaPeso() {
    // Recupera de forma síncrona el array histórico de marcas desde el LocalStorage a través del servicio
    const historialPeso = this.fitService.getHistorialPeso() || [];
    
    // Mapeo inicial de las colecciones de datos dividiéndolas en dos arrays independientes primitivos (Eje X y Eje Y)
    let fechas = historialPeso.map((p: any) => p.fecha);
    let pesos = historialPeso.map((p: any) => p.valor);

    // Si el usuario solo tiene 1 día registrado, un gráfico de líneas no puede trazar un vector.
    if (historialPeso.length === 1) {
      fechas = ['Inicio', fechas[0]];
      pesos = [pesos[0], pesos[0]]; 
    } else if (historialPeso.length === 0) {
      // Estado por defecto si la app arranca de cero de forma desértica
      fechas = ['Sin datos'];
      pesos = [0];
    }

    // Busca si el elemento canvas del DOM ya aloja una instancia gráfica viva.
    const chartExistente = Chart.getChart(this.chartPeso.nativeElement);
    if (chartExistente) chartExistente.destroy();

    // Instanciación del constructor gráfico lineal sobre el nativeElement del primer canvas
    new Chart(this.chartPeso.nativeElement, {
      type: 'line', // Tipo de gráfica lineal continua
      data: {
        labels: fechas, // Eje X: Cadenas cronológicas de marcas de control
        datasets: [{
          label: 'Peso Corporal (kg)',
          data: pesos, // Eje Y: Registro de masa en kilogramos
          borderColor: '#7cf6f6', // Tu color de acento Aqua premium de la interfaz
          backgroundColor: 'rgba(124, 246, 246, 0.1)', // Sombreado translúcido inferior bajo la curva
          borderWidth: 3, // Grosor marcado de la línea guía principal
          tension: 0.3, // Suavizado Bézier para curvar los picos y dar un look fluido
          fill: true // Habilita el relleno del área inferior de la gráfica
        }]
      },
      options: {
        responsive: true, // Habilita el redimensionado elástico automático
        maintainAspectRatio: false, // Rompe la proporción nativa para ajustarse estrictamente a los píxeles fijados en el SCSS
        plugins: { legend: { display: false } } // Oculta la leyenda superior para limpiar el espacio útil en pantallas compactas
      }
    });
  }

  // Algoritmo encargado de procesar y renderizar la gráfica mixta
  generarGraficaCalorias() {
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']; // Etiquetas estáticas semanales para el Eje X
    
    // Recupera del servicio el array de 7 posiciones correspondientes a las calorías consumidas reales de la semana en curso
    const kcalReales = this.fitService.getKcalSemanales() || [0, 0, 0, 0, 0, 0, 0];
    
    // Extrae la tasa metabólica calculada por Harris-Benedict en el Perfil para fijarla como línea de corte estricta
    const tmbObjetivo = this.fitService.getMetabolismoBasal() || 1800; 
    const objetivoData = Array(7).fill(tmbObjetivo); // Crea una colección idéntica rellena de 7 puntos simétricos para trazar la meta

    // Limpieza de seguridad de la instancia gráfica previa acoplada al segundo canvas
    const chartExistente = Chart.getChart(this.chartCalorias.nativeElement);
    if (chartExistente) chartExistente.destroy();

    // Instanciación del constructor gráfico compuesto (Multi-axis chart dataset)
    new Chart(this.chartCalorias.nativeElement, {
      type: 'bar', // Tipo base estructural asignado al contenedor general
      data: {
        labels: dias,
        datasets: [
          {
            type: 'bar', // Forzado explícito de tipo barra para representar la ingesta diaria acumulada
            label: 'Kcal Consumidas',
            data: kcalReales,
            backgroundColor: '#a855f7', // Tu color Violeta Eléctrico corporativo
            borderRadius: 8 // Suavizado curvo en las cabezas de las columnas de nutrientes
          },
          {
            type: 'line', // Forzado explícito de tipo línea superpuesta para representar la meta calórica
            label: 'Tu Objetivo (TMB)',
            data: objetivoData,
            borderColor: '#f97316', // Tu color de avisos Naranja Fuego destacado
            borderWidth: 2,
            borderDash: [5, 5], // Transforma la línea continua en discontinua punteada de aspecto técnico profesional
            fill: false, // Desactiva el relleno inferior para no tapar los bloques morados de las barras
            pointRadius: 0 // Elimina los marcadores circulares en los vértices limpiando el ruido visual
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top' } // Habilita la leyenda superior obligatoriamente para que el usuario diferencie el consumo del objetivo estricto
        }
      }
    });
  }
}