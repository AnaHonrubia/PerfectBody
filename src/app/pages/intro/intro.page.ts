import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { 
        IonContent, IonButtons, IonText
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  sparklesOutline, restaurantOutline, barbellOutline, 
  analyticsOutline, checkmarkDoneCircleOutline 
} from 'ionicons/icons';

import { BotonOscuroComponent } from 'src/app/componentes/atomos/boton-oscuro/boton-oscuro.component';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [
            CommonModule, BotonOscuroComponent, IonContent, 
            IonButtons
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class IntroPage {
  constructor(private router: Router) {
    addIcons({
      sparklesOutline, restaurantOutline, barbellOutline, analyticsOutline, checkmarkDoneCircleOutline 
    })
  }

  irAPerfil() {
    this.router.navigate(['/perfil']); // Ruta directa al perfil
  }
}