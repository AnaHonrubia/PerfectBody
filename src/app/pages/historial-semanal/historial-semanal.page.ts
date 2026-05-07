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

  // Referencia al canvas del HTML
  @ViewChild('barChart') barChart!: ElementRef; 
  // Aquí definimos la variable que te faltaba
  semanas: any[] = [];
  chart: any;

  constructor(private fitService: FitAtomic) { }

  ngOnInit() {

  }

  // Cada vez que entramos a la página, leemos el historial del servicio
  ionViewDidEnter() {
    this.cargarHistorial();
    // El setTimeout nos asegura que el HTML esté listo al 100%
    setTimeout(() => {
      this.createChart(); 
    }, 200);
  }

  cargarHistorial() {
    const historialReal = this.fitService.getSemanas()
  }

  obtenerColorKcal(kcal: number): string {
    if (kcal < 16500) {
      return '#2dd36f'; // Verde (Bien)
    } else if (kcal >= 16500 && kcal <= 18500) {
      return '#ffca22'; // Naranja (Regular)
    } else {
      return '#eb445a'; // Rojo (Exceso)
    }
  }

  createChart() {
    if (this.chart) { 
      this.chart.destroy(); 
    }

    // DETECCIÓN DINÁMICA DE COLOR
    // Comprobamos si el body tiene la clase del modo oscuro
    const isDark = document.body.classList.contains('ion-palette-dark') || document.body.classList.contains('dark');
    
    // Si es oscuro, usamos blanco; si no, negro.
    const contrastColor = isDark ? '#ffffff' : '#000000';
    // Líneas de cuadrícula: blanco muy transparente o negro muy transparente
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    const datosGrafica = [...this.semanas].slice(0, 5).reverse();
    const etiquetas = datosGrafica.map(s => s.fechaCierre);
    const valoresKcal = datosGrafica.map(s => s.kcal);

    this.chart = new Chart(this.barChart.nativeElement, {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [{
        label: 'Kcal Semanales',
        data: valoresKcal,
        backgroundColor: '#7cf6f6', 
        barThickness: 20,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: contrastColor } // <--- COLOR DE LA LEYENDA
        }
      },
      scales: {
        y: {
          ticks: { color: contrastColor }, // <--- COLOR NÚMEROS EJE Y
          grid: { color: gridColor }       // <--- COLOR LÍNEAS HORIZONTALES
        },
        x: {
          ticks: { color: contrastColor }, // <--- COLOR TEXTOS EJE X
          grid: { display: false }
        }
      }
    }
  });
}
}
