import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FitAtomic {
  private http = inject(HttpClient);
  private URL_ALIMENTOS = 'https://raw.githubusercontent.com/AnaHonrubia/APIs/refs/heads/main/alimentos.json';
  private URL_EJERCICIOS = 'https://raw.githubusercontent.com/AnaHonrubia/APIs/refs/heads/main/ejercicios.json';

  private listaAlimentos: any[] = [];
  private historialDiario: { [fecha: string]: any[] } = {}; 
  private perfilUsuario = { peso: 0, altura: 0, edad: 0, tmb: 0 };
  private historialSemanas: any[] = [];
  darkMode: boolean = false;
  private listaEjercicios: any[] = [];
  private historialEntrenos: { [fecha: string]: any[] } = {};

  constructor() {
    this.cargarAlimentosRemote();
    this.inicializarTema();
    this.cargarDesdeMemoria();
    this.cargarSemanasDesdeMemoria();
    this.verificarCierreSemanalAutomatico();
    this.cargarEntrenosDesdeMemoria();
  }

  // --- LÓGICA DE TEMA (MODO OSCURO) ---
  setDarkMode(activar: boolean) {
    this.darkMode = activar;
    // Ionic usa la clase .ion-palette-dark en versiones modernas
    if (activar) {
      document.body.classList.add('ion-palette-dark');
    } else {
      document.body.classList.remove('ion-palette-dark');
    }
    localStorage.setItem('darkMode', activar.toString());
  }

  inicializarTema(){
      const preferencia = localStorage.getItem('darkMode') === 'true';
      this.setDarkMode(preferencia);
  }

  // --- ALIMENTOS ---
  async cargarAlimentosRemote() {
    try {
      this.listaAlimentos = await firstValueFrom(this.http.get<any[]>(this.URL_ALIMENTOS));
    } catch (error) {
      console.error("Error descargando alimentos", error);
    }
  }

  // --- DIARIO Y PERSISTENCIA ---
  private guardarEnMemoria() {
    localStorage.setItem('perfectBody_historial', JSON.stringify(this.historialDiario));
  }

  private cargarDesdeMemoria() {
    const datos = localStorage.getItem('perfectBody_historial');
    if (datos) this.historialDiario = JSON.parse(datos);
  }

  agregarAlDiario(alimento: any, fecha: string) {
    if (!this.historialDiario[fecha]) {
      this.historialDiario[fecha] = [];
    }
    const entrada = {
      id: alimento.id || Date.now().toString(),
      nombre: alimento.nombre,
      imagen: alimento.imagen,
      // Priorizamos kcal, si no existe usamos calorias
      kcal: Number(alimento.kcal || alimento.calorias) || 0,
      protes: Number(alimento.protes || alimento.proteinas) || 0,
      carbos: Number(alimento.carbos || alimento.carbohidratos) || 0,
      grasas: Number(alimento.grasas) || 0,
      momento: alimento.momento
    };
    this.historialDiario[fecha].push(entrada);
    this.guardarEnMemoria();
  }

  eliminarComida(id: string, fecha: string) {
    if (this.historialDiario[fecha]) {
      this.historialDiario[fecha] = this.historialDiario[fecha].filter(item => item.id !== id);
      this.guardarEnMemoria();
    }
  }

  getDiarioPorFecha(fecha: string) {
    return this.historialDiario[fecha] || [];
  }

  getTotalesPorFecha(fecha: string) {
    let totales = { kcal: 0, protes: 0, carbos: 0, grasas: 0 };
    const comidas = this.getDiarioPorFecha(fecha);

    comidas.forEach(alim => {
      totales.kcal += alim.kcal || 0;
      totales.protes += alim.protes || 0;
      totales.carbos += alim.carbos || 0;
      totales.grasas += alim.grasas || 0;
    });
    
    // REDONDEO A 2 DECIMALES:
    return {
      kcal: Math.round(totales.kcal), // Las calorías mejor sin decimales
      protes: Math.round(totales.protes * 100) / 100,
      carbos: Math.round(totales.carbos * 100) / 100,
      grasas: Math.round(totales.grasas * 100) / 100
    };

  }

  // --- PERFIL Y OBJETIVOS ---
  guardarPerfil(datos: any): number {
    this.perfilUsuario.peso = datos.peso;
    this.perfilUsuario.altura = datos.altura;
    this.perfilUsuario.edad = datos.edad;
    
    // Guardamos el objeto completo para la función obtenerPerfil()
    localStorage.setItem('perfectBody_perfil_datos', JSON.stringify(datos));

    // Tu lógica de TMB
    this.perfilUsuario.tmb = (10 * datos.peso) + (6.25 * datos.altura) - (5 * datos.edad) + 5;
    localStorage.setItem('perfectBody_objetivo', this.perfilUsuario.tmb.toString());
    
    return this.perfilUsuario.tmb;
  }

  getObjetivoKcal(): number {
    const guardado = localStorage.getItem('perfectBody_objetivo');
    return guardado ? parseInt(guardado) : 0;
  }

  // --- HISTORIAL SEMANAL ---
  cargarSemanasDesdeMemoria(){
    const datos = localStorage.getItem('perfectBody_semanas');
    this.historialSemanas = datos ? JSON.parse(datos) : [];
  }

  getSemanas(): any[] {
    const datos = localStorage.getItem('perfectBody_semanas');
    return datos ? JSON.parse(datos) : [];
  }

  borrarSemana(index: number) {
    const semanas = this.getSemanas();
    semanas.splice(index, 1);
    localStorage.setItem('perfectBody_semanas', JSON.stringify(semanas));
  }

  // Añade esto dentro de la clase FitAtomicService
  obtenerPerfil() {
    const guardado = localStorage.getItem('perfectBody_perfil_datos');
    return guardado ? JSON.parse(guardado) : null;
  }

  // Modificamos para que devuelva la lista actual
  getAlimentos() {
    return this.listaAlimentos;
  }

  // Añadimos esta versión que devuelve la promesa para esperar desde la página
  async getAlimentosAsync() {
    if (this.listaAlimentos.length === 0) {
      await this.cargarAlimentosRemote();
    }
    return this.listaAlimentos;
  }

  // Función que detecta si hay una semana que se deba cerrar
  verificarCierreSemanal() {
    const ultimaFechaCierre = localStorage.getItem('fecha_ultimo_cierre');
    const hoy = new Date();
    
    // Si hoy es lunes y no se cerró la semana ayer (domingo)
    if (hoy.getDay() === 1 && ultimaFechaCierre !== hoy.toLocaleDateString()) {
      console.log("Detectado lunes: Procediendo al cierre automático de la semana pasada...");
      this.ejecutarCierreDeSemana();
      // Guardamos la fecha de hoy para que no lo vuelva a intentar hasta el próximo lunes
      localStorage.setItem('fecha_ultimo_cierre', hoy.toLocaleDateString());
    }
  }

  private ejecutarCierreDeSemana() {
    const resumenSemanal = { kcal: 0, protes: 0, grasas: 0, carbos: 0 };
    const hoy = new Date();
    
    // Suma los datos de los últimos 7 días (de lunes a domingo)
    for (let i = 1; i <= 7; i++) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() - i);
      const fechaStr = fecha.toLocaleDateString();
      
      const totalesDia = this.getTotalesPorFecha(fechaStr);
      resumenSemanal.kcal += totalesDia.kcal;
      resumenSemanal.protes += totalesDia.protes;
      resumenSemanal.grasas += totalesDia.grasas;
      resumenSemanal.carbos += totalesDia.carbos;
    }

    // Se guarda el historial de todos los macros redondeados
    this.guardarCierreSemanal(resumenSemanal);
  }

  guardarCierreSemanal(datos: any) {
    const semanas = this.getSemanas();
    const nuevaSemana = {
      id: Date.now(),
      fechaCierre: new Date().toLocaleDateString(),
      kcal: Math.round(datos.kcal),
      protes: Math.round(datos.protes * 10) / 10,
      grasas: Math.round(datos.grasas * 10) / 10,
      carbos: Math.round(datos.carbos * 10) / 10
    };
    
    semanas.unshift(nuevaSemana);
    localStorage.setItem('perfectBody_semanas', JSON.stringify(semanas));
  }

  verificarCierreSemanalAutomatico() {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); 
    const hoyStr = hoy.toLocaleDateString();
    const ultimoCierre = localStorage.getItem('ultimo_cierre_auto');

    // Si hoy es LUNES y NO se ha cerrado todavía...
    if (hoy.getDay() === 1 && ultimoCierre !== hoyStr) {
      
      // Se marcas como cerrado para bloquear cualquier otra ejecución inmediata
      localStorage.setItem('ultimo_cierre_auto', hoyStr);
      
      console.log('Ejecutando cierre semanal único...');

      const ayer = new Date();
      ayer.setDate(hoy.getDate() - 1);
      const ayerStr = ayer.toLocaleDateString();
      
      // Solo se cierra si ayer hubo cena (nuestra regla de oro)
      const diarioAyer = this.getDiarioPorFecha(ayerStr);
      if (diarioAyer.some(c => c.momento === 'Cena')) {
        this.ejecutarCierreDeSemana();
      } else {
        // Si no hubo cena, se borra la marca por si el usuario la apunta más tarde hoy
        localStorage.removeItem('ultimo_cierre_auto');
        console.log('Cierre cancelado: falta registro de cena ayer.');
      }
    }
  }

  // Función que descarga el JSON
  private guardarEntrenosEnMemoria() {
    localStorage.setItem('perfectBody_entrenos', JSON.stringify(this.historialEntrenos));
  }

  private cargarEntrenosDesdeMemoria() {
    const datos = localStorage.getItem('perfectBody_entrenos');
    if (datos) this.historialEntrenos = JSON.parse(datos);
  }

  // Guardar una sesión
  guardarSesionEntreno(sesion: any) {
    const fecha = sesion.fecha;
    if (!this.historialEntrenos[fecha]) {
      this.historialEntrenos[fecha] = [];
    }
    this.historialEntrenos[fecha].push(sesion);
    this.guardarEntrenosEnMemoria();
    console.log('Entrenamiento guardado con éxito para:', fecha);
  }

  // Función para que la página de entreno obtenga la lista
  getEjercicios() {
    return this.listaEjercicios;
  }
  
}