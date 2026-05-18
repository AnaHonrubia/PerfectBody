import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumen-nutricional',
  templateUrl: './resumen-nutricional.component.html',
  styleUrls: ['./resumen-nutricional.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ResumenNutricionalComponent {
  
  // Puertos de entrada de datos (@Input) inyectados de forma asíncrona desde el estado global del diario de nutrición
  @Input() caloriasConsumidas: number = 0; // Sumatorio de la energía total del día de hoy
  @Input() objetivoCalorico: number = 2000; // Meta metabólica base calculada por Harris-Benedict

  // Atributos de entrada específicos para el control de los tres macros principales del atleta
  @Input() proteinas: number = 0; // Gramos totales de proteína acumulados
  @Input() grasas: number = 0; // Gramos totales de lípidos/grasas acumulados
  @Input() carbohidratos: number = 0; // Gramos totales de hidratos de carbono acumulados
}