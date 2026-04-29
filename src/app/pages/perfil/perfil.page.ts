import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
// Importamos la calculadora
import { CalculadoraMetabolicaComponent } from '../../componentes/organismos/calculadora-metabolica/calculadora-metabolica.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, CalculadoraMetabolicaComponent] // <--- IMPORTANTE
})
export class PerfilPage {
  constructor() {}

  manejarCalculo(datos: any) {
    console.log('Datos recibidos de la calculadora:', datos);
    // Aquí iría la fórmula de Harris-Benedict que mencionabas en el txt
  }
}