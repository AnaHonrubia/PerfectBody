import { Component, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selector-fecha',
  templateUrl: './selector-fecha.component.html',
  styleUrls: ['./selector-fecha.component.scss'],
  standalone: true,
  imports : [IonicModule, CommonModule]
})

export class SelectorFechaComponent {
  @Output() fechaCambiante = new EventEmitter<string>();

  onDateChange(event: any) {
    const fecha = new Date(event.detail.value).toLocaleDateString();
    this.fechaCambiante.emit(fecha);
  }
}
