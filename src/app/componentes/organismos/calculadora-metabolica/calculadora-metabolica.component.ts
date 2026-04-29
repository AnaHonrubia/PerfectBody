import { Component, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Revisa que estas rutas sean correctas según tu carpeta
import { InputDatoComponent } from '../../atomos/input-dato/input-dato.component';
import { BotonAccionComponent } from '../../atomos/boton-accion/boton-accion.component';

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
export class CalculadoraMetabolicaComponent {
  // Asegúrate de que estos nombres existan para que el HTML no de error
  peso: number = 0;
  altura: number = 0;
  edad: number = 0;

  @Output() onCalcular = new EventEmitter<any>();

  enviarDatos() {
    this.onCalcular.emit({
      peso: this.peso,
      altura: this.altura,
      edad: this.edad
    });
  }
}