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
  // Matriz reactiva encargada de almacenar los objetos de las recetas estructuradas en la app
  recetas: any[] = [];

  constructor(private fitService: FitAtomic) {
    // Registro optimizado del recurso vectorial en el motor caché en memoria de Ionic
    addIcons({ addCircleOutline });
  }

  async ngOnInit() {
    // Descargamos las recetas de la nube al iniciar y suspendemos el hilo local mediante 'await' hasta recibir la colección exitosa
    this.recetas = await this.fitService.getRecetasAsync();
  }

  // Método que inserta un objeto de receta completo directo al diario de nutrición de hoy.
  agregarAlDiarioHoy(receta: any) {
    // Genera la estampa cronológica exacta actual del terminal en formato string regional (dd/mm/aaaa) para indexarla como clave
    const hoyStr = new Date().toLocaleDateString();
    
    // Inyectamos el plato completo directamente en el LocalStorage pasándole la referencia cronológica estricta de hoy
    this.fitService.añadirRecetaAlDiario(receta, hoyStr);
    
    // Feedback visual rápido (UX) para alertar al usuario de que la inyección de datos en la base local concluyó con éxito
    alert(`¡${receta.nombre} añadida a tu diario de hoy!`);
  }
}