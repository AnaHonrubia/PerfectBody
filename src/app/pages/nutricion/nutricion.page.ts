import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FitAtomic } from '../../services/fit-atomic';
import { ResumenNutricionalComponent } from '../../componentes/organismos/resumen-nutricional/resumen-nutricional.component';
import { TarjetaAlimentosComponent } from '../../componentes/moleculas/tarjeta-alimentos/tarjeta-alimentos.component';
import { SelectorFechaComponent } from '../../componentes/moleculas/selector-fecha/selector-fecha.component';
import { ListaConsumoComponent } from '../../componentes/organismos/lista-consumo/lista-consumo.component';
import { BotonOscuroComponent } from 'src/app/componentes/atomos/boton-oscuro/boton-oscuro.component';

import { addIcons } from 'ionicons';
import { listOutline } from 'ionicons/icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nutricion',
  templateUrl: './nutricion.page.html',
  styleUrls: ['./nutricion.page.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [IonicModule, CommonModule, ResumenNutricionalComponent, TarjetaAlimentosComponent, 
    ListaConsumoComponent, SelectorFechaComponent, BotonOscuroComponent, RouterModule]
})

export class NutricionPage {
  alimentos: any[] = [];
  comidasDelDia: any[] = [];
  fechaSeleccionada: string = new Date().toLocaleDateString();
  totales = { kcal: 0, protes: 0, carbos: 0, grasas: 0 };
  objetivoDiario: number = 0;

  esHoy: boolean = true; // Controla si mostramos la galeria de añadir
  momentoActual: string = 'Desayuno'; // Saber que momento del día está seleccionado

  constructor(private fitService: FitAtomic) {
    addIcons({ listOutline });
  }

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
    // Verificamo si estamos en el dia de hoy (en el calendario) 
    if (!this.esHoy) {
      console.warn('No puedes añadir comida en días pasados');
      return;
    }

    // Creamos el objeto asegurando que el momento sea el correcto
    const nuevaEntrada = {
      id: Date.now().toString(),
      nombre: alimento.nombre,
      imagen: alimento.imagen,
      // Mapeamos los nombres de tu API (calorias, proteinas...) a los de tu App (kcal, protes...)
      kcal: alimento.kcal || alimento.calorias || 0,
      protes: alimento.protes || alimento.proteinas || 0,
      carbos: alimento.carbos || alimento.carbohidratos || 0,
      grasas: alimento.grasas || 0,
      momento: momento 
    };

    // 3. Guardamos en el servicio
    this.fitService.agregarAlDiario(nuevaEntrada, this.fechaSeleccionada);
    
    // 4. FORZAMOS EL REFRESCO: Volvemos a llamar a la lógica de filtrado
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
    // Obtenemos TODO desde la API 
    const todasDelDia = this.fitService.getDiarioPorFecha(this.fechaSeleccionada);

    // Solo se envia al componente de la lista que coincide con el boton azul
    this.comidasDelDia = todasDelDia.filter(c =>
      c.momento === this.momentoActual
    );

    // Actualizamos el resumen de arriba
    this.totales = this.fitService.getTotalesPorFecha(this.fechaSeleccionada);
    this.objetivoDiario = this.fitService.getObjetivoKcal();

    // Lógica de bloqueo: Comparamos la fecha seleccionada con la de hoy 
    const hoyStr = new Date().toLocaleDateString();
    this.esHoy = (this.fechaSeleccionada === hoyStr);

  }

  // Esta función se dispara cuando haces clic en Comida, Merienda, etc.
  cambiarMomento(event: any) {
    this.momentoActual = event.detail.value; // Actualizamos el momento
    this.actualizarVista(); // Refrescamos la lista para que solo salgan los de ese momento
  }

  // Función para saber si podemos mostrar el botón de cierre
  puedeCerrarSemana(): boolean {
    const hoy = new Date();
    const esDomingo = hoy.getDay() === 0; // 0 = Domingo
    
    // Verificamos si hay algo en la cena hoy
    const tieneCena = this.comidasDelDia.some(c => c.momento === 'Cena');

    // Solo habilitamos si es domingo, es la fecha de hoy y tiene cena
    return esDomingo && this.esHoy && tieneCena;
  }

  // Función que ejecuta el cierre manual
  cerrarSemanaManual() {
    // Calculamos los totales de los últimos 7 días
    const resumenSemanal = { kcal: 0, protes: 0, grasas: 0, carbos: 0 };
    const hoy = new Date();

    for (let i = 0; i < 7; i++) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() - i);
      const fechaStr = fecha.toLocaleDateString();
      
      const totalesDia = this.fitService.getTotalesPorFecha(fechaStr);
      resumenSemanal.kcal += totalesDia.kcal;
      resumenSemanal.protes += totalesDia.protes;
      resumenSemanal.grasas += totalesDia.grasas;
      resumenSemanal.carbos += totalesDia.carbos;
    }

    this.fitService.guardarCierreSemanal(resumenSemanal);
    alert('¡Semana cerrada con éxito! Ya puedes verla en tu historial.');
  }

}