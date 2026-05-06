import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList,
         IonCard, IonButtons, IonBackButton, IonIcon, IonCardHeader,
         IonCardSubtitle, IonCardTitle, IonCardContent, IonGrid,
         IonRow, IonCol
 } from '@ionic/angular/standalone';
 import { FitAtomic } from 'src/app/services/fit-atomic';

@Component({
  selector: 'app-historial-semanal',
  templateUrl: './historial-semanal.page.html',
  styleUrls: ['./historial-semanal.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
            IonList, IonCard, IonButtons, IonBackButton, IonIcon, IonCardHeader,
            IonCardSubtitle, IonCardTitle, IonCardContent, IonGrid, IonRow,
            IonCol
  ]
})

export class HistorialSemanalPage implements OnInit {
  
  // Aquí definimos la variable que te faltaba
  semanas: any[] = [];

  constructor(private fitService: FitAtomic) { }

  ngOnInit() {
    this.cargarHistorial();
  }

  // Cada vez que entramos a la página, leemos el historial del servicio
  ionViewWillEnter() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.semanas = this.fitService.getSemanas();
  }
}
