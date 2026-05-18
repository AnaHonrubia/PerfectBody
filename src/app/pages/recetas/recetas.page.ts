import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FitAtomic } from 'src/app/services/fit-atomic';
import { BotonOscuroComponent } from '../../componentes/atomos/boton-oscuro/boton-oscuro.component';
import { addIcons } from 'ionicons';
import { addCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, BotonOscuroComponent]
})
export class RecetasPage implements OnInit {
  recetas: any[] = [];

  constructor(private fitService: FitAtomic) {
    addIcons({ addCircleOutline });
  }

  async ngOnInit() {
    // Descargamos las recetas de la nube al iniciar
    this.recetas = await this.fitService.getRecetasAsync();
  }

  agregarAlDiarioHoy(receta: any) {
    const hoyStr = new Date().toLocaleDateString();
    // Inyectamos el plato completo directamente en el LocalStorage
    this.fitService.añadirRecetaAlDiario(receta, hoyStr);
    
    // Feedback visual rápido para el usuario
    alert(`¡${receta.nombre} añadida a tu diario de hoy!`);
  }
}