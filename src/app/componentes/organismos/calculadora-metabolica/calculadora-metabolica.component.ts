import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Revisa que estas rutas sean correctas según tu carpeta
import { InputDatoComponent } from '../../atomos/input-dato/input-dato.component';
import { BotonAccionComponent } from '../../atomos/boton-accion/boton-accion.component';

import { FitAtomic } from 'src/app/services/fit-atomic';

@Component({
  selector: 'app-calculadora-metabolica',
  templateUrl: './calculadora-metabolica.component.html',
  standalone: true,
  imports: [
    IonicModule, 
    FormsModule, 
    CommonModule, 
    InputDatoComponent, 
    BotonAccionComponent
  ]
})

export class CalculadoraMetabolicaComponent implements OnInit {
  peso: number | null = null;
  altura: number | null = null;
  edad: number | null = null;

  @Output() onCalcular = new EventEmitter<any>();

  constructor(private fitService: FitAtomic) {}

  ngOnInit() {
    // Cargar datos previos si existen
    const datos = this.fitService.obtenerPerfil();
    if (datos) {
      this.peso = datos.peso;
      this.altura = datos.altura;
      this.edad = datos.edad;
    }
  }

  enviarDatos() {
    this.onCalcular.emit({
      peso: this.peso,
      altura: this.altura,
      edad: this.edad
    });
  }
}