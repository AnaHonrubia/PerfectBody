import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FitAtomic } from '../../services/fit-atomic';
import { ResumenNutricionalComponent } from '../../componentes/organismos/resumen-nutricional/resumen-nutricional.component';
import { TarjetaAlimentosComponent } from '../../componentes/moleculas/tarjeta-alimentos/tarjeta-alimentos.component';

@Component({
  selector: 'app-nutricion',
  templateUrl: './nutricion.page.html',
  styleUrls: ['./nutricion.page.scss'],
  standalone: true,
  // IMPORTANTE: Asegúrate de que IonicModule esté aquí para que reconozca ion-grid, ion-col, etc.
  imports: [IonicModule, CommonModule, ResumenNutricionalComponent, TarjetaAlimentosComponent]
})
export class NutricionPage implements OnInit {
  
  // Declaramos la variable que le falta al HTML
  alimentos: any[] = [];
  fechaActual: string = new Date().toLocaleDateString();

  constructor(private fitService: FitAtomic) { }

  async ngOnInit() {
    // Esperamos a que el servicio tenga los datos listos
    this.alimentos = await this.fitService.getAlimentosAsync();
    
    // Forzamos una actualización por si acaso
    console.log('Alimentos cargados:', this.alimentos.length);
  }

  // Cambiamos 'añadirComida' por 'agregarComida' para evitar el error de la 'ñ'
  agregarComida(alimento: any) {
    this.fitService.agregarAlDiario(alimento, this.fechaActual);
    console.log('Alimento agregado:', alimento.nombre);
  }
}