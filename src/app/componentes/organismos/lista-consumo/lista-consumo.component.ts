import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons'; 
import { trash } from 'ionicons/icons'; 

@Component({
  selector: 'app-lista-consumo',
  templateUrl: './lista-consumo.component.html',
  styleUrls: ['./lista-consumo.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule] 
})
export class ListaConsumoComponent {
  @Input() comidas: any[] = [];
  @Output() onEliminar = new EventEmitter<string>();

  constructor() {
    // Registramos el icono para que Ionic sepa dibujarlo
    addIcons({ trash });
  }

  contarComidasEn(momento: string): number {
    return this.comidas.filter(c => c.momento === momento).length;
  }

}