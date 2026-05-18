import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CalculadoraMetabolicaComponent } from '../../componentes/organismos/calculadora-metabolica/calculadora-metabolica.component';
import { BotonOscuroComponent } from '../../componentes/atomos/boton-oscuro/boton-oscuro.component';
import { FitAtomic } from 'src/app/services/fit-atomic';

import { addIcons } from 'ionicons';
import { trophyOutline, flameOutline, shieldCheckmarkOutline, add } from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, CalculadoraMetabolicaComponent, BotonOscuroComponent] // <--- IMPORTANTE
})

export class PerfilPage {
  resultadoTMB: number | null = null;
  logros: any[] = [];

  constructor(private fitService: FitAtomic) {
    // Ahora fitService ya tiene el método obtenerPerfil()
    const datosGuardados = this.fitService.obtenerPerfil();
    if (datosGuardados) {
      this.manejarCalculo(datosGuardados);
    }
    addIcons({
      trophyOutline, flameOutline, shieldCheckmarkOutline
    });
  }

  ngOnInit() {
    this.cargarLogros();
  }

  manejarCalculo(datos: any) {
    const p = Number(datos.peso);
    const a = Number(datos.altura);
    const e = Number(datos.edad);

    // Fórmula de Harris-Benedict corregida
    this.resultadoTMB = Math.round(88.362 + (13.397 * p) + (4.799 * a) - (5.677 * e));
    
    // Se pasa el TMB al servicio para que lo use Nutrición
    this.fitService.guardarPerfil({
      ...datos,
      tmb: this.resultadoTMB
    });
  }

  // Se ejecuta cada vez que el usuario entra a la pestaña para comprobar si ha ganado una medalla
  ionViewWillEnter() {
    this.cargarLogros();
  }

  cargarLogros() {
    this.logros = this.fitService.getLogrosUsuario();
  }

}