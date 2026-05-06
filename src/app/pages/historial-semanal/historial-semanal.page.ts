import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList,
         IonCard
 } from '@ionic/angular/standalone';

@Component({
  selector: 'app-historial-semanal',
  templateUrl: './historial-semanal.page.html',
  styleUrls: ['./historial-semanal.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
            IonList, IonCard
  ]
})
export class HistorialSemanalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
