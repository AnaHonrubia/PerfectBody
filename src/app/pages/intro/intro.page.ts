import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { 
        IonContent, IonButtons, IonText
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  sparklesOutline, restaurantOutline, barbellOutline, analyticsOutline, checkmarkDoneCircleOutline, medalOutline, compassOutline,
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
  // Se inyecta el servicio Router nativo de Angular para controlar la navegación por código entre pantallas
  constructor(private router: Router) {
    // Registro optimizado en caché de la librería de vectores para la iconografía del carrusel informativo
    addIcons({
      sparklesOutline, restaurantOutline, barbellOutline, analyticsOutline, checkmarkDoneCircleOutline, medalOutline, compassOutline,
    })
  }

  // Redirige al usuario de manera imperativa hacia la pestaña de perfil, al pulsar el botón
  irAPerfil() {
    this.router.navigate(['/perfil']); // Ejecuta la transición de ruta hacia el PerfilPage
  }
}