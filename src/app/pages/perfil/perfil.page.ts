import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CalculadoraMetabolicaComponent } from '../../componentes/organismos/calculadora-metabolica/calculadora-metabolica.component';
import { BotonOscuroComponent } from '../../componentes/atomos/boton-oscuro/boton-oscuro.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, CalculadoraMetabolicaComponent, BotonOscuroComponent] // <--- IMPORTANTE
})

export class PerfilPage {
  resultadoTMB: number | null = null;

  manejarCalculo(datos: any) {
    // Convertimos a número por si acaso vienen como string
    const p = parseFloat(datos.peso);
    const a = parseFloat(datos.altura);
    const e = parseInt(datos.edad);

    // Fórmula para hombres (puedes ajustarla si quieres)
    // TMB = 88.362 + (13.397 x peso) + (4.799 x altura) - (5.677 x edad)
    this.resultadoTMB = Math.round(88.362 + (13.397 * p) + (4.799 * a) - (5.677 * e));
  }
}