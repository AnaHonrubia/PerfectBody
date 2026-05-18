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

  @ViewChild('chartPeso') chartPeso!: ElementRef;
  @ViewChild('chartCalorias') chartCalorias!: ElementRef;

  constructor(private fitService: FitAtomic) {}

  ngOnInit() {}

  // Usamos ionViewWillEnter para que las gráficas se actualicen CADA VEZ que el usuario entra en la pestaña
  ionViewWillEnter() {
    if (this.chartPeso && this.chartCalorias) {
      this.generarGraficaPeso();
      this.generarGraficaCalorias();
    }
  }

  ngAfterViewInit() {
    this.generarGraficaPeso();
    this.generarGraficaCalorias();
  }

  generarGraficaPeso() {
    // Extraemos el historial real de pesos guardado en el servicio
    const historialPeso = this.fitService.getHistorialPeso() || [];
    
    // Si no hay datos, ponemos unos por defecto para que no se vea vacío, si solo hay un dia metido, duplicamos el punto para pintar una linea recta
    let fechas = historialPeso.map((p: any) => p.fecha);
    let pesos = historialPeso.map((p: any) => p.valor);

    if (historialPeso.length === 1) {
      fechas = ['Inicio', fechas[0]];
      pesos = [pesos[0], pesos[0]]; // Línea recta estable
    } else if (historialPeso.length === 0) {
      fechas = ['Sin datos'];
      pesos = [0];
    }

    // Destruimos la gráfica anterior si existe para evitar que se duplique al recargar
    const chartExistente = Chart.getChart(this.chartPeso.nativeElement);
    if (chartExistente) chartExistente.destroy();

    new Chart(this.chartPeso.nativeElement, {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [{
          label: 'Peso Corporal (kg)',
          data: pesos,
          borderColor: '#7cf6f6',
          backgroundColor: 'rgba(124, 246, 246, 0.1)',
          borderWidth: 3,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  generarGraficaCalorias() {
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    // 2. Extraemos las calorías reales que el usuario ha consumido esta semana desde el diario de nutrición
    const kcalReales = this.fitService.getKcalSemanales() || [0, 0, 0, 0, 0, 0, 0];
    
    // 3. Extraemos el Metabolismo Basal (TMB) calculado en el perfil para usarlo como línea objetivo
    const tmbObjetivo = this.fitService.getMetabolismoBasal() || 1800; 
    const objetivoData = Array(7).fill(tmbObjetivo); // Crea una línea recta de 7 puntos

    const chartExistente = Chart.getChart(this.chartCalorias.nativeElement);
    if (chartExistente) chartExistente.destroy();

    new Chart(this.chartCalorias.nativeElement, {
      type: 'bar',
      data: {
        labels: dias,
        datasets: [
          {
            type: 'bar',
            label: 'Kcal Consumidas',
            data: kcalReales,
            backgroundColor: '#a855f7',
            borderRadius: 8
          },
          {
            type: 'line',
            label: 'Tu Objetivo (TMB)',
            data: objetivoData,
            borderColor: '#f97316', // Tu nuevo Naranja Fuego para resaltar el aviso
            borderWidth: 2,
            borderDash: [5, 5], // Línea discontinua súper pro
            fill: false,
            pointRadius: 0 // Sin puntitos molestos
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top' } // Aquí sí la mostramos para diferenciar la barra del objetivo
        }
      }
    });
  }
}