import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumen-nutricional',
  templateUrl: './resumen-nutricional.component.html',
  styleUrls: ['./resumen-nutricional.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ResumenNutricionalComponent implements OnInit {

  @Input() consumidas: number = 0;
  @Input() objetivoKcal: number = 2000; 
  @Input() proteinas: number = 0;
  @Input() grasas: number = 0;
  @Input() carbohidratos: number = 0;

  constructor() { }

  ngOnInit() {}

  // Cálculo para la barra de progreso
  get porcentaje(): number {
    return (this.consumidas / this.objetivoKcal) || 0;
  }
}
