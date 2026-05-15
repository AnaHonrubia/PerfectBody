import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FitAtomic } from './services/fit-atomic';

import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true, // Asegúrate de que tenga esto si usas imports
  imports: [IonApp, IonRouterOutlet],
})

export class AppComponent {
  constructor(private fitService: FitAtomic) {
    register(); // Lo llamamos aquí dentro también por seguridad
    this.fitService.verificarCierreSemanal();
  }
}
