import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { FitAtomic } from 'src/app/services/fit-atomic';

// Registramos los componentes internos de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-progreso',
  templateUrl: './progreso.page.html',
  styleUrls: ['./progreso.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ProgresoPage implements OnInit, AfterViewInit {

  // Obtenemos una referencia a los canvas del HTML
  @ViewChild('chartPeso') chartPeso!: ElementRef;
  @ViewChild('chartCalorias') chartCalorias!: ElementRef;

  constructor(private fitService: FitAtomic) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.generarGraficaPeso();
    this.generarGraficaCalorias();
  }

  generarGraficaPeso() {
    // Datos de ejemplo (Mañana los vincularemos a tu LocalStorage/Servicio)
    const fechas = ['01/05', '05/05', '10/05', '15/05'];
    const pesos = [74.2, 73.8, 73.5, 73.05]; // Ajustado a tus mediciones reales

    new Chart(this.chartPeso.nativeElement, {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [{
          label: 'Peso Corporal (kg)',
          data: pesos,
          borderColor: '#7cf6f6', // Tu color Aqua
          backgroundColor: 'rgba(124, 246, 246, 0.1)',
          borderWidth: 3,
          tension: 0.3, // Curvatura de la línea
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false } // Ocultamos la leyenda para ganar espacio
        }
      }
    });
  }

  generarGraficaCalorias() {
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const kcalConsumidas = [1850, 1900, 1650, 2100, 1750, 0, 0]; // Datos semanales

    new Chart(this.chartCalorias.nativeElement, {
      type: 'bar',
      data: {
        labels: dias,
        datasets: [{
          label: 'Kcal Consumidas',
          data: kcalConsumidas,
          backgroundColor: '#a855f7', // Tu nuevo Violeta Eléctrico
          borderRadius: 8 // Barras redondeadas modernas
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}