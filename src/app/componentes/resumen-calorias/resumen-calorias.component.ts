import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumen-calorias',
  templateUrl: './resumen-calorias.component.html',
  styleUrls: ['./resumen-calorias.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ResumenCaloriasComponent {
  // Entradas de datos para que sea dinámico
  @Input() consumidas: number = 0;
  @Input() objetivo: number = 2000;
  @Input() proteinas: number = 0;
  @Input() grasas: number = 0;
  @Input() carbohidratos: number = 0;

  constructor() {}

  // Cálculo para el círculo de progreso
  get porcentaje(): number {
    return this.consumidas / this.objetivo;
  }
}