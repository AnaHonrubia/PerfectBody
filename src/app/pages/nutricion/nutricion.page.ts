import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FitAtomic } from '../../services/fit-atomic';
import { ResumenNutricionalComponent } from '../../componentes/organismos/resumen-nutricional/resumen-nutricional.component';
import { TarjetaAlimentosComponent } from '../../componentes/moleculas/tarjeta-alimentos/tarjeta-alimentos.component';
import { SelectorFechaComponent } from '../../componentes/moleculas/selector-fecha/selector-fecha.component';
import { ListaConsumoComponent } from '../../componentes/organismos/lista-consumo/lista-consumo.component';
import { BotonOscuroComponent } from 'src/app/componentes/atomos/boton-oscuro/boton-oscuro.component';

@Component({
  selector: 'app-nutricion',
  templateUrl: './nutricion.page.html',
  styleUrls: ['./nutricion.page.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [IonicModule, CommonModule, ResumenNutricionalComponent, TarjetaAlimentosComponent, 
    ListaConsumoComponent, SelectorFechaComponent, BotonOscuroComponent]
})

export class NutricionPage {
  alimentos: any[] = [];
  comidasDelDia: any[] = [];
  fechaSeleccionada: string = new Date().toLocaleDateString();
  totales = { kcal: 0, protes: 0, carbos: 0, grasas: 0 };
  objetivoDiario: number = 0;

  esHoy: boolean = true; // Controla si mostramos la galeria de añadir

  constructor(private fitService: FitAtomic) {}

  async ngOnInit() {
    console.log('Iniciando carga de nutrición...');
    
    // Cargamos el objetivo primero (es instantáneo)
    this.objetivoDiario = this.fitService.getObjetivoKcal();
    
    // Intentamos traer los alimentos
    try {
      const res = await this.fitService.getAlimentosAsync();
      if (res) {
        this.alimentos = res;
        console.log('Alimentos cargados con éxito:', this.alimentos.length);
      }
    } catch (error) {
      console.error('Error al cargar alimentos:', error);
      // Carga de emergencia por si falla el internet
      this.alimentos = this.fitService.getAlimentos(); 
    }

    this.actualizarVista();
  }

  cambiarFecha(nuevaFecha: string) {
    this.fechaSeleccionada = nuevaFecha;
    console.log('Cambiando a fecha:', this.fechaSeleccionada);
    this.actualizarVista();
  }

  agregarComida(alimento: any, momento: string) {
    // Validaciones de seguridad
    if (!alimento || !this.esHoy) {
      return;
    } 

    // Creamos el objeto limpio para el servicio
    const nuevaEntrada = {
      id: Date.now().toString(), // ID único
      nombre: alimento.nombre,
      imagen: alimento.imagen,
      // Aseguramos que los valores sean números, o 0 si no vienen
      kcal: Number(alimento.kcal) || 0,
      protes: Number(alimento.protes) || 0,
      carbos: Number(alimento.carbos) || 0,
      grasas: Number(alimento.grasas) || 0,
      momento: momento // Guardamos 'Desayuno', 'Comida', etc.
    };

    // Guardamos en el servicio pasando la FECHA seleccionada
  this.fitService.agregarAlDiario(nuevaEntrada, this.fechaSeleccionada);
  
  // Refrescamos la pantalla 
  this.actualizarVista();
  }

  eliminarComida(id: string) {
    // Borramos del servicio
    this.fitService.eliminarComida(id, this.fechaSeleccionada);
    
    // Refrescamos la vista para que el array se actualice
    this.actualizarVista();
    
    console.log('Alimento eliminado:', id);
  }

  actualizarVista() {
    // Al cambiar esta variable, la lista-consumo se limpia y se rellena sola
    this.comidasDelDia = this.fitService.getDiarioPorFecha(this.fechaSeleccionada);
    this.totales = this.fitService.getTotalesPorFecha(this.fechaSeleccionada);
    this.objetivoDiario = this.fitService.getObjetivoKcal();

    // Lógica de bloqueo: Comparamos la fecha seleccionada con la de hoy 
    const hoyStr = new Date().toLocaleDateString();
    this.esHoy = (this.fechaSeleccionada === hoyStr);

  }

}