import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FitAtomic } from 'src/app/services/fit-atomic';

import { 
  IonList, IonListHeader, IonLabel, IonItem, IonIcon,
  IonButton, IonButtons 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-lista-entrenos-hoy',
  templateUrl: './lista-entrenos-hoy.component.html',
  styleUrls: ['./lista-entrenos-hoy.component.scss'],
  standalone: true,
  imports: [CommonModule, IonList, IonListHeader, IonLabel, IonItem, IonIcon,
            IonButton, IonButtons
  ]
})
export class ListaEntrenosHoyComponent implements OnInit {
  entrenosHoy: any[] = [];
  fechaHoy: string = new Date().toLocaleDateString();

  constructor(private fitService: FitAtomic) {
    addIcons ({
      checkmarkCircle, trashOutline
    });
  }

  ngOnInit() {
    this.cargarEntrenos();
  }

  cargarEntrenos() {
    // Obtenemos del servicio lo que ya se ha guardado hoy
    const historial = this.fitService.getHistorialEntrenos(); 
    this.entrenosHoy = historial[this.fechaHoy] || [];
  }

  eliminar(id: number) {
    this.fitService.eliminarEntreno(id, this.fechaHoy);
    this.cargarEntrenos(); // Recargamos la lista local
  }
}
