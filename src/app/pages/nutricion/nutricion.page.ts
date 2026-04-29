import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
// IMPORTANTE: Ruta y nombre corregidos tras el cambio a Organismos
import { ResumenNutricionalComponent } from '../../componentes/organismos/resumen-nutricional/resumen-nutricional.component';
@Component({
  selector: 'app-nutricion',
  templateUrl: './nutricion.page.html',
  styleUrls: ['./nutricion.page.scss'],
  standalone: true,
  // AÑADIMOS el nuevo componente aquí
  imports: [IonicModule, CommonModule, ResumenNutricionalComponent]
})
export class NutricionPage implements OnInit {
  constructor() { }
  ngOnInit() { }
}