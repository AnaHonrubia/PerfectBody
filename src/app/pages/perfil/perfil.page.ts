import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CalculadoraMetabolicaComponent } from '../../componentes/organismos/calculadora-metabolica/calculadora-metabolica.component';
import { BotonOscuroComponent } from '../../componentes/atomos/boton-oscuro/boton-oscuro.component';
import { FitAtomic } from 'src/app/services/fit-atomic';

import { addIcons } from 'ionicons';
import { trophyOutline, flameOutline, shieldCheckmarkOutline, add } from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, CalculadoraMetabolicaComponent, BotonOscuroComponent] // <--- IMPORTANTE
})

export class PerfilPage {
  // Atributos de estado reactivo local de la sección del atleta
  resultadoTMB: number | null = null; // Almacena el valor numérico entero final del Metabolismo Basal
  logros: any[] = []; // Matriz volátil encargada de albergar la lista de insignias de gamificación

  constructor(private fitService: FitAtomic) {
    
    const datosGuardados = this.fitService.obtenerPerfil();
    if (datosGuardados) {
      // Si la persistencia contiene información previa, fuerza de inmediato el cálculo metabólico
      this.manejarCalculo(datosGuardados);
    }
    
    // Registro optimizado de los activos vectoriales de medallas en el diccionario en caché de Ionic
    addIcons({
      trophyOutline, flameOutline, shieldCheckmarkOutline
    });
  }

  ngOnInit() {
    this.cargarLogros();
  }

  // Método analítico centralizado encargado de procesar la ciencia metabólica.
  manejarCalculo(datos: any) {
    // Cast manual explícito a tipo Number de seguridad para prevenir concatenaciones de texto accidentales
    const p = Number(datos.peso);
    const a = Number(datos.altura);
    const e = Number(datos.edad);

    // Ecuación Científica de Harris-Benedict (Revisión original)
    this.resultadoTMB = Math.round(88.362 + (13.397 * p) + (4.799 * a) - (5.677 * e));
    
    // Sincronización Transversal: Almacena en la persistencia global el objeto completo inyectando la nueva clave 'tmb'
    this.fitService.guardarPerfil({
      ...datos, // Operador de propagación para copiar todas las propiedades de usuario previas
      tmb: this.resultadoTMB // Inyección del dato energético calculado que leerá la pestaña de Nutrición
    });
  }
  
  ionViewWillEnter() {
    this.cargarLogros(); // Refresco inmediato del estado de las insignias en pantalla (Efecto reactivo de recompensa)
  }

  // Consulta al servicio el estado analítico de los logros para refrescar la matriz local.
  cargarLogros() {
    this.logros = this.fitService.getLogrosUsuario();
  }

}