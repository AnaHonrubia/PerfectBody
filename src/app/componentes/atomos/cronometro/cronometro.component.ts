import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { playOutline, pauseOutline, refreshOutline } from 'ionicons/icons';

@Component({
  selector: 'app-cronometro',
  templateUrl: './cronometro.component.html',
  styleUrls: ['./cronometro.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CronometroComponent {
  tiempo: number = 60; // 60 segundos por defecto
  corriendo: boolean = false;
  intervalo: any;

  constructor(){
    addIcons({
      playOutline, pauseOutline, refreshOutline
    });
  }

  iniciar() {
    if (this.corriendo) return;
    this.corriendo = true;
    this.intervalo = setInterval(() => {
      if (this.tiempo > 0) {
        this.tiempo--;
      } else {
        this.detener();
        this.reproducirSonido();
      }
    }, 1000);
  }

  detener() {
    clearInterval(this.intervalo);
    this.corriendo = false;
  }

  reiniciar() {
    this.detener();
    this.tiempo = 60;
  }

  reproducirSonido() {
    const audio = new Audio('assets/sounds/beep.mp3');
    audio.play();
  }
}