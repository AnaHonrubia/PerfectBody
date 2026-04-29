import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { addCircle } from 'ionicons/icons';

@Component({
  selector: 'app-tarjeta-alimentos',
  templateUrl: './tarjeta-alimentos.component.html',
  styleUrls: ['./tarjeta-alimentos.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TarjetaAlimentosComponent {
  @Input() nombre: string = '';
  @Input() kcal: number = 0;
  @Input() imagen: string = '';

  @Output() onAdd = new EventEmitter<void>();

  constructor() {
    addIcons({ addCircle });
  }
}