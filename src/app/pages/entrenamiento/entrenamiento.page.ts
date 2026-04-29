import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons } from '@ionic/angular/standalone';
import { BotonOscuroComponent } from '../../componentes/atomos/boton-oscuro/boton-oscuro.component';

@Component({
  selector: 'app-entrenamiento',
  templateUrl: './entrenamiento.page.html',
  styleUrls: ['./entrenamiento.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    BotonOscuroComponent, IonButtons
  ]
})
export class EntrenamientoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
