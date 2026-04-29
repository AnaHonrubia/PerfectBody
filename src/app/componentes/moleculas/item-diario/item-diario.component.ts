import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-item-diario',
  templateUrl: './item-diario.component.html',
  styleUrls: ['./item-diario.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ItemDiarioComponent {
  @Input() nombre: string = '';
  @Input() caloriasTotales: number = 0;
  
  @Input() puedeBorrar: boolean = true; 

  @Output() onBorrar = new EventEmitter<void>();

  constructor(){
    addIcons({ trashOutline });
  }

  // Función que se ejecuta al hacer clic en el botón 🗑️
  borrarItem() {
    this.onBorrar.emit();
  }
}