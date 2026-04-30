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
  // Entradas para calorías
  @Input() caloriasConsumidas: number = 0;
  @Input() objetivoCalorico: number = 2000;

  // Entradas para Macros (LAS QUE FALTABAN)
  @Input() proteinas: number = 0;
  @Input() grasas: number = 0;
  @Input() carbohidratos: number = 0;
}