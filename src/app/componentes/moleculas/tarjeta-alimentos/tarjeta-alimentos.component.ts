import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BotonAccionComponent } from '../../atomos/boton-accion/boton-accion.component';
import { EtiquetaCaloriaComponent } from '../../atomos/etiqueta-caloria/etiqueta-caloria.component';

@Component({
  selector: 'app-tarjeta-alimento',
  templateUrl: './tarjeta-alimento.component.html',
  styleUrls: ['./tarjeta-alimento.component.scss'],
  standalone: true,
  imports: [BotonAccionComponent, EtiquetaCaloriaComponent]
})

export class TarjetaAlimentoComponent {
  @Input() nombre: string = '';
  @Input() calorias: number = 0;
  @Input() imagen: string = '';
  @Output() onAnadir = new EventEmitter<void>();
  puedoAnadir() { 
    this.onAnadir.emit(); 
  }
}