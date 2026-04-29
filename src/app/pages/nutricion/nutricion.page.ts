import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FitAtomic } from '../../services/fit-atomic';
import { ResumenNutricionalComponent } from '../../componentes/organismos/resumen-nutricional/resumen-nutricional.component';
import { TarjetaAlimentosComponent } from '../../componentes/moleculas/tarjeta-alimentos/tarjeta-alimentos.component';
import { SelectorFechaComponent } from '../../componentes/moleculas/selector-fecha/selector-fecha.component';
import { ListaConsumoComponent } from '../../componentes/organismos/lista-consumo/lista-consumo.component';

@Component({
  selector: 'app-nutricion',
  templateUrl: './nutricion.page.html',
  styleUrls: ['./nutricion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ResumenNutricionalComponent, TarjetaAlimentosComponent, ListaConsumoComponent, SelectorFechaComponent]
})

export class NutricionPage implements OnInit {
  alimentos: any[] = [];
  comidasDelDia: any[] = [];
  fechaSeleccionada: string = new Date().toLocaleDateString();
  totales = { kcal: 0, protes: 0, carbos: 0, grasas: 0 };
  objetivoDiario: number = 0;

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
    this.actualizarVista();
  }

  agregarComida(alimento: any) {
    if (!alimento) return;

    // Creamos un objeto limpio para evitar errores de propiedades faltantes
    const comidaParaAñadir = {
      nombre: alimento.nombre || 'Sin nombre',
      imagen: alimento.imagen || '',
      kcal: alimento.kcal || alimento.calorias || 0,
      protes: alimento.protes || alimento.proteinas || 0,
      carbos: alimento.carbos || alimento.carbohidratos || 0,
      grasas: alimento.grasas || 0
    };

    this.fitService.agregarAlDiario(comidaParaAñadir, this.fechaSeleccionada);
    this.actualizarVista(); // Esto refresca la lista y los totales inmediatamente
  }

  eliminarComida(id: string) {
    this.fitService.eliminarComida(id, this.fechaSeleccionada);
    this.actualizarVista();
  }

  actualizarVista() {
    this.comidasDelDia = this.fitService.getDiarioPorFecha(this.fechaSeleccionada);
    this.totales = this.fitService.getTotalesPorFecha(this.fechaSeleccionada);

    //Pedimos al servicio el objetivo calculado en el perfil
    this.objetivoDiario = this.fitService.getObjetivoKcal();
  }
}