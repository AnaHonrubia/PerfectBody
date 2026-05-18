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
  // Propiedades de estado local encargadas de almacenar las métricas bioantropométricas del atleta
  peso: number | null = null;
  altura: number | null = null;
  edad: number | null = null;

  // Evento de salida que emite un objeto estructurado con las variables necesarias para Harris-Benedict
  @Output() onCalcular = new EventEmitter<any>();

  // El constructor implementa la inyección de dependencias para acceder a los datos guardados en memoria del servicio
  constructor(private fitService: FitAtomic) {}

  ngOnInit() {
    // Intenta extraer la estructura del perfil desde la persistencia local
    const datos = this.fitService.obtenerPerfil();
    if (datos) {
      // Si existen datos previos, los asigna al estado reactivo mapeándolos en la vista de forma inmediata
      this.peso = datos.peso;
      this.altura = datos.altura;
      this.edad = datos.edad;
    }
  }

  /**
   * Método de empaquetado y control. Agrupa las variables del formulario en un objeto JSON 
   * y las lanza en un único evento hacia la página principal del perfil para ejecutar las fórmulas analíticas.
   */
  enviarDatos() {
    this.onCalcular.emit({
      peso: this.peso,
      altura: this.altura,
      edad: this.edad
    });
  }
}