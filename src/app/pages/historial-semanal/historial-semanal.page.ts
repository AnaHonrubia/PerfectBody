import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList,
         IonCard, IonButtons, IonBackButton, IonIcon, IonCardHeader,
         IonCardSubtitle, IonCardTitle, IonCardContent, IonGrid,
         IonRow, IonCol
 } from '@ionic/angular/standalone';
 import { FitAtomic } from 'src/app/services/fit-atomic';

import { Chart, registerables } from 'chart.js'; 
Chart.register(...registerables);

@Component({
  selector: 'app-historial-semanal',
  templateUrl: './historial-semanal.page.html',
  styleUrls: ['./historial-semanal.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
            IonList, IonCard, IonButtons, IonBackButton, IonIcon, IonCardHeader,
            IonCardSubtitle, IonCardTitle, IonCardContent, IonGrid, IonRow,
            IonCol
  ]
})

export class HistorialSemanalPage implements OnInit {

  // Captura la referencia nativa del elemento canvas `#barChart` declarado en el HTML.
  @ViewChild('barChart') barChart!: ElementRef; 
  
  // Atributos de estado local de la página
  semanas: any[] = []; // Matriz donde se almacenan los cierres históricos consolidados traídos del servicio
  chart: any; // Instancia global del gráfico para poder destruirla y redibujarla de forma limpia sin fugas de memoria

  constructor(private fitService: FitAtomic) { }

  // Ciclo de inicialización por defecto de Angular
  ngOnInit() {}

  ionViewDidEnter() {
    this.cargarHistorial(); // Sincroniza la matriz local con los datos actualizados del LocalStorage

    setTimeout(() => {
      this.createChart(); 
    }, 200);
  }

  // Consume el método público del servicio central para recuperar los históricos semanales del atleta.
  cargarHistorial() {
    this.semanas = this.fitService.getSemanas();
  }

  // Función analítica de semáforo visual. Devuelve un código hexadecimal de color acorde al rango calórico
  obtenerColorKcal(kcal: number): string {
    if (kcal < 16500) {
      return '#2dd36f'; // Verde: Indica rango de definición o mantenimiento limpio
    } else if (kcal >= 16500 && kcal <= 18500) {
      return '#ffca22'; // Naranja: Rango de aviso o volumen controlado
    } else {
      return '#eb445a'; // Rojo: Exceso calórico estricto respecto a los objetivos semanales
    }
  }

  // Algoritmo de construcción y parametrización de la gráfica de barras de Chart.js.
  createChart() {
    // CONTROL DE SEGURIDAD EN MEMORIA: Si la variable ya contiene un gráfico previo, lo destruye, para que no haya 2 iguales
    if (this.chart) { 
      this.chart.destroy(); 
    }

    // Lee la lista de clases inyectada en la raíz por el BotonOscuroComponent.
    const isDark = document.body.classList.contains('ion-palette-dark') || document.body.classList.contains('dark');
    const contrastColor = isDark ? '#ffffff' : '#000000'; // Color de etiquetas tipográficas
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'; // Color de las líneas guías de la cuadrícula

    // Clonamos la colección, aislamos los últimos 5 cierres y volteamos el orden (reverse) 
    const datosGrafica = [...this.semanas].slice(0, 5).reverse();
    const etiquetas = datosGrafica.map(s => s.fechaCierre); // Eje X: Cadenas de fechas de los lunes de cierre
    const valoresKcal = datosGrafica.map(s => s.kcal); // Eje Y: Carga calórica de la semana

    // Instanciación del constructor gráfico vinculándolo al canvas del DOM a través de nativeElement
    this.chart = new Chart(this.barChart.nativeElement, {
      type: 'bar', // Gráfico de barras verticales de alto rendimiento
      data: {
        labels: etiquetas,
        datasets: [{
          label: 'Kcal Semanales',
          data: valoresKcal,
          backgroundColor: '#7cf6f6', // Color acento Aqua premium de la aplicación
          barThickness: 20, // Grosor fijo de cada barra en píxeles para asegurar simetría en móvil
          borderRadius: 5 // Suavizado de esquinas en la punta de las barras corporativo
        }]
      },
      options: {
        responsive: true, // Habilita el redimensionado elástico automático si cambia la orientación del terminal
        plugins: {
          legend: {
            labels: { color: contrastColor } // Sincroniza el texto de la leyenda con el modo activo
          }
        },
        scales: {
          y: {
            ticks: { color: contrastColor }, // Sincroniza los números de escala del eje vertical
            grid: { color: gridColor } // Pinta las rejillas horizontales con transparencias accesibles
          },
          x: {
            ticks: { color: contrastColor }, // Sincroniza las fechas del eje horizontal
            grid: { display: false } // Remueve las líneas verticales para limpiar el ruido visual en layouts densos
          }
        }
      }
    });
  }
}