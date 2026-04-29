import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FitAtomic {
  private http = inject(HttpClient);
  private URL_ALIMENTOS = 'https://raw.githubusercontent.com/AnaHonrubia/APIs/refs/heads/main/alimentos.json';

  private listaAlimentos: any[] = [];
  private historialDiario: { [fecha: string]: any[] } = {}; 
  private perfilUsuario = { peso: 0, altura: 0, edad: 0, tmb: 0 };
  private historialSemanas: any[] = [];
  darkMode: boolean = false;

  constructor() {
    this.cargarAlimentosRemote();
    this.inicializarTema();
    this.cargarDesdeMemoria();
    this.cargarSemanasDesdeMemoria();
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
      id: Date.now().toString(),
      nombre: alimento.nombre,
      imagen: alimento.imagen,
      kcal: alimento.calorias || alimento.kcal, // Adaptamos por si la API usa 'calorias'
      protes: alimento.proteinas || alimento.protes,
      carbos: alimento.carbohidratos || alimento.carbos,
      grasas: alimento.grasas
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
    return totales;
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

  guardarCierreSemanal(datosSemana: any){
    const semanas = this.getSemanas();
    semanas.unshift({
      fechaCierre: new Date().toLocaleDateString(),
      resumen: datosSemana
    });
    localStorage.setItem('perfectBody_semanas', JSON.stringify(semanas));
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
}