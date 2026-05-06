import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FitAtomic } from './services/fit-atomic';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private fitService: FitAtomic) {
    this.fitService.verificarCierreSemanal();
  }
}
