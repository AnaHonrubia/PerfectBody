import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FitAtomic {
  // Inyección funcional moderna del servicio de peticiones HTTP nativo de Angular
  private http = inject(HttpClient);
  
  // Endpoints remotos estricto-estáticos que apuntan a los repositorios JSON en producción (GitHub)
  private URL_ALIMENTOS = 'https://raw.githubusercontent.com/AnaHonrubia/APIs/refs/heads/main/alimentos.json';
  private URL_EJERCICIOS = 'https://raw.githubusercontent.com/AnaHonrubia/APIs/refs/heads/main/ejercicios.json';
  private URL_RECETAS = 'https://raw.githubusercontent.com/AnaHonrubia/APIs/refs/heads/main/recetas.json';

  // Variables de estado en memoria 
  private listaAlimentos: any[] = []; // Almacena el catálogo general de productos alimenticios descargados
  private historialDiario: { [fecha: string]: any[] } = {}; // Estructura de diccionario indexada por strings de fecha (dd/mm/aaaa)
  private perfilUsuario = { peso: 0, altura: 0, edad: 0, tmb: 0 }; // Estructura bioantropométrica base del atleta
  private historialSemanas: any[] = []; // Matriz analítica para almacenar los cierres consolidados semanales
  darkMode: boolean = false; // Flag de control del estado visual global
  private listaEjercicios: any[] = []; // Almacena el catálogo de movimientos de fuerza descargados
  private historialEntrenos: { [fecha: string]: any[] } = {}; // Diccionario indexado para las marcas de las series de gimnasio
  private listaRecetas: any[] = []; // Almacena el catálogo de cocina fitness

  constructor() {
    // Orquestación secuencial de inicialización síncrona/asíncrona en el arranque único del servicio
    this.cargarAlimentosRemote(); // Lanza la descarga de comida del repositorio remoto
    this.inicializarTema(); // Restaura la paleta de color según las preferencias salvadas del usuario
    this.cargarDesdeMemoria(); // Vuelca el diario nutricional guardado del LocalStorage a la memoria RAM
    this.cargarSemanasDesdeMemoria(); // Recupera los bloques de históricos semanales consolidados
    this.verificarCierreSemanalAutomatico(); // Dispara la lógica transaccional de seguridad de corte de lunes
    this.cargarEjerciciosRemote(); // Descarga la biblioteca técnica de movimientos deportivos
    this.cargarEntrenosDesdeMemoria(); // Restaura el histórico de marcas y pesas de gimnasio
    this.cargarRecetasRemote(); // Descarga los platos fitness de la nube
  }

  // =======================================
  //     LÓGICA DE TEMA (MODO OSCURO)
  // =======================================
  
  // Guarda de forma persistente la variable de configuración en formato plano String.
  setDarkMode(activar: boolean) {
    this.darkMode = activar; // Sincroniza la propiedad de estado interna del servicio
    
    // Inyección condicional adaptada a las directivas estrictas de paletas oscuras de Ionic modernas
    if (activar) {
      document.body.classList.add('ion-palette-dark'); // Inyecta la directiva de inversión en cascada de variables CSS
    } else {
      document.body.classList.remove('ion-palette-dark'); // Remueve la directiva forzando el tema claro por defecto
    }
    // Serialización primitiva del estado booleano para su almacenamiento síncrono local
    localStorage.setItem('darkMode', activar.toString());
  }

  // Método de recuperación que lee el estado previo guardado en el terminal durante el constructor.
  inicializarTema(){
      const preferencia = localStorage.getItem('darkMode') === 'true'; // Evaluación estricta de string a booleano
      this.setDarkMode(preferencia); // Dispara el formateador de clases sobre el body
  }

  // =========================================
  //     MÉTODOS PARA EL MÓDULO DE ALIMENTOS
  // =========================================

  // Método que descarga de forma masiva el JSON remoto de alimentos.
  async cargarAlimentosRemote() {
    try {
      // Suspende la ejecución local de forma no bloqueante hasta que la petición GET responda con éxito
      this.listaAlimentos = await firstValueFrom(this.http.get<any[]>(this.URL_ALIMENTOS));
    } catch (error) {
      console.error("Error descargando alimentos", error); // Captura excepciones físicas de red o DNS caídos
    }
  }

  // =======================================
  //     DIARIO Y PERSISTENCIA
  // =======================================
  
  // Método que convierte el objeto complejo de la RAM en una cadena JSON estática.
  private guardarEnMemoria() {
    localStorage.setItem('perfectBody_historial', JSON.stringify(this.historialDiario));
  }
  
  // Método que recupera el String del LocalStorage y recompone el diccionario original.
  private cargarDesdeMemoria() {
    const datos = localStorage.getItem('perfectBody_historial');
    // Deserializa el JSON recuperado inyectándolo en el buffer dinámico de control de la app
    if (datos) this.historialDiario = JSON.parse(datos);
  }
  
  // Método que inserta un nuevo registro alimenticio dentro de la matriz asociada a una fecha clave.
  agregarAlDiario(alimento: any, fecha: string) {
    // Mecanismo de inicialización perezosa: si la clave de la fecha no existe en el diccionario, instancia un array vacío
    if (!this.historialDiario[fecha]) {
      this.historialDiario[fecha] = [];
    }
    
    // Construcción estricta de la celda de datos homogenizada
    const entrada = {
      id: alimento.id || Date.now().toString(), // Clave primaria basada en marca de tiempo si el objeto carece de identificador
      nombre: alimento.nombre,
      imagen: alimento.imagen,
      // Mecanismo de tolerancia de APIs alternativas: captura campos sin importar si se nombran de forma reducida u oficial
      kcal: Number(alimento.kcal || alimento.calorias) || 0, // Cast forzado explícito a tipo primitivo numérico
      protes: Number(alimento.protes || alimento.proteinas) || 0, // Garantiza que no entren tipos String al sumador
      carbos: Number(alimento.carbos || alimento.carbohidratos) || 0,
      grasas: Number(alimento.grasas) || 0,
      momento: alimento.momento // Categoría de ingesta (ej: 'Desayuno')
    };
    
    this.historialDiario[fecha].push(entrada); // Inserta la celda en la colección de la fecha correspondiente
    this.guardarEnMemoria(); // Vuelca el nuevo estado general al almacenamiento a largo plazo
  }
  
  // Método que elimina un alimento específico de una lista diaria aplicando un filtrado por exclusión en el array.
  eliminarComida(id: string, fecha: string) {
    if (this.historialDiario[fecha]) {
      // Sobreescribe la colección conservando únicamente los elementos cuyo identificador no coincide con el buscado
      this.historialDiario[fecha] = this.historialDiario[fecha].filter(item => item.id !== id);
      this.guardarEnMemoria(); // Sincroniza la mutación en el LocalStorage
    }
  }

  // Método de lectura que actúa como pasarela de datos para las listas de las páginas.
  getDiarioPorFecha(fecha: string) {
    return this.historialDiario[fecha] || [];
  }
  
  // Algoritmo de consolidación de macronutrientes diarios.
  getTotalesPorFecha(fecha: string) {
    let totales = { kcal: 0, protes: 0, carbos: 0, grasas: 0 }; // Inicialización de los acumuladores en cero
    const comidas = this.getDiarioPorFecha(fecha); // Recupera los elementos válidos del día

    // Bucle imperativo síncrono para ejecutar los sumatorios algebraicos
    comidas.forEach(alim => {
      totales.kcal += alim.kcal || 0;
      totales.protes += alim.protes || 0;
      totales.carbos += alim.carbos || 0;
      totales.grasas += alim.grasas || 0;
    });
    
    // REDONDEO CONTROLADO DE PRECISIÓN FLOTANTE (Previene el fallo de aproximación binaria de JavaScript IEEE 754)
    return {
      kcal: Math.round(totales.kcal), // Las calorías energéticas se redondean al entero más cercano por usabilidad (sin decimales)
      protes: Math.round(totales.protes * 100) / 100, // Multiplica por 100, redondea al entero y divide por 100 para aislar estrictamente 2 decimales
      carbos: Math.round(totales.carbos * 100) / 100,
      grasas: Math.round(totales.grasas * 100) / 100
    };
  }

  // =======================================
  //     PERFIL Y OBJETIVOS
  // =======================================

  // Método que almacena las variables físicas del usuario y calcula de forma paralela la meta calórica.
  guardarPerfil(datos: any): number {
    this.perfilUsuario.peso = datos.peso;
    this.perfilUsuario.altura = datos.altura;
    this.perfilUsuario.edad = datos.edad;
    
    // Guarda de forma síncrona el objeto completo estructurado para su posterior lectura íntegra en el Perfil
    localStorage.setItem('perfectBody_perfil_datos', JSON.stringify(datos));

    // Ecuación Metabólica Basal Secundaria Integrada
    this.perfilUsuario.tmb = (10 * datos.peso) + (6.25 * datos.altura) - (5 * datos.edad) + 5;
    // Persiste de forma directa el valor numérico transformado en string para su uso transversal en Nutrición
    localStorage.setItem('perfectBody_objetivo', this.perfilUsuario.tmb.toString());
    
    return this.perfilUsuario.tmb;
  }

  getObjetivoKcal(): number {
    const guardado = localStorage.getItem('perfectBody_objetivo');
    return guardado ? parseInt(guardado) : 0; // Parsea la cadena almacenada a tipo entero nativo primitivo
  }

  // =======================================
  //     HISTORIAL SEMANAL
  // =======================================
  
  // Método que sincroniza la matriz local de memoria RAM
  cargarSemanasDesdeMemoria(){
    const datos = localStorage.getItem('perfectBody_semanas');
    this.historialSemanas = datos ? JSON.parse(datos) : [];
  }

  // Método que recupera una copia de cierres semanales para alimentar las gráficas
  getSemanas(): any[] {
    const datos = localStorage.getItem('perfectBody_semanas');
    return datos ? JSON.parse(datos) : [];
  }

  // Método que elimina un nodo semanal específico
  borrarSemana(index: number) {
    const semanas = this.getSemanas(); // Extrae la colección de la persistencia
    semanas.splice(index, 1); // Ejecuta la mutación recortando la celda seleccionada
    localStorage.setItem('perfectBody_semanas', JSON.stringify(semanas)); // Reescribe el LocalStorage con la matriz limpia
  }

  // Método que recupera los datos guardados del usuario para inicializar formularios.
  obtenerPerfil() {
    const guardado = localStorage.getItem('perfectBody_perfil_datos');
    return guardado ? JSON.parse(guardado) : null;
  }

  getAlimentos() {
    return this.listaAlimentos;
  }

  async getAlimentosAsync() {
    if (this.listaAlimentos.length === 0) {
      await this.cargarAlimentosRemote(); // Espera la resolución del hilo HTTP asíncrono de red
    }
    return this.listaAlimentos;
  }

  // Método que controla cronologicamente
  verificarCierreSemanal() {
    const ultimaFechaCierre = localStorage.getItem('fecha_ultimo_cierre');
    const hoy = new Date();
    
    // hoy.getDay() === 1 evalúa si es Lunes en el huso horario local del smartphone
    if (hoy.getDay() === 1 && ultimaFechaCierre !== hoy.toLocaleDateString()) {
      console.log("Detectado lunes: Procediendo al cierre automático de la semana pasada...");
      this.ejecutarCierreDeSemana(); // Dispara la agregación analítica retrospectiva de macros
      // Inyecta una marca de control en el LocalStorage para impedir que el bucle vuelva a ejecutarse en las siguientes lecturas del mismo lunes
      localStorage.setItem('fecha_ultimo_cierre', hoy.toLocaleDateString());
    }
  }

  // Método que agrupa y computa las cargas nutricionales de los últimos 7 días cerrados.
  private ejecutarCierreDeSemana() {
    const resumenSemanal = { kcal: 0, protes: 0, grasas: 0, carbos: 0 }; // Inicialización de contadores semanales
    const hoy = new Date();
    
    // Bucle iterativo decreciente estricto: viaja exactamente 7 pasos de 24 horas hacia el pasado en el diario
    for (let i = 1; i <= 7; i++) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() - i); // Resta algebraicamente los días calendario
      const fechaStr = fecha.toLocaleDateString(); // Construye el String que actúa como clave primaria en el diccionario
      
      const totalesDia = this.getTotalesPorFecha(fechaStr); // Recupera los acumulados redondeados de esa fecha específica
      resumenSemanal.kcal += totalesDia.kcal; // Sumatorio masivo acumulativo de energía
      resumenSemanal.protes += totalesDia.protes; // Acumulativo de bloque proteico semanal
      resumenSemanal.grasas += totalesDia.grasas;
      resumenSemanal.carbos += totalesDia.carbos;
    }

    // Vuelca la instantánea cerrada final con sus correspondientes redondeos estricto-ordinales en la persistencia
    this.guardarCierreSemanal(resumenSemanal);
  }

  // Método que agrega un objeto semanal cerrado al frente de la cola histórica
  guardarCierreSemanal(datos: any) {
    const semanas = this.getSemanas(); // Recupera la colección previa guardada
    const nuevaSemana = {
      id: Date.now(), // ID único basado en marca de tiempo UNIX numérico
      fechaCierre: new Date().toLocaleDateString(), // Estampa de fecha del lunes en que se consolida el informe
      kcal: Math.round(datos.kcal), // Redondeo entero calórico
      protes: Math.round(datos.protes * 10) / 10, // Aislamiento de un único decimal estricto para simplificación visual de informes
      grasas: Math.round(datos.grasas * 10) / 10,
      carbos: Math.round(datos.carbos * 10) / 10
    };
    
    semanas.unshift(nuevaSemana); // Inserta el nuevo ciclo cerrado al inicio de la matriz (Orden cronológico inverso de visualización)
    localStorage.setItem('perfectBody_semanas', JSON.stringify(semanas)); // Reescribe y congela el objeto JSON resultante
  }

  // Método que se ejecuta en el arranque para validar si se debe consolidar la semana
  verificarCierreSemanalAutomatico() {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); 
    const hoyStr = hoy.toLocaleDateString();
    const ultimoCierre = localStorage.getItem('ultimo_cierre_auto');

    // Validación estricta por calendario: hoy.getDay() === 1 verifica que la CPU del móvil se encuentre en Lunes
    if (hoy.getDay() === 1 && ultimoCierre !== hoyStr) {
      
      // Bloqueo inmediato preventivo: escribe la clave de control en el LocalStorage para evitar colisiones 
      // o solapamientos concurrentes si el constructor asíncrono se re-ejecuta rápido
      localStorage.setItem('ultimo_cierre_auto', hoyStr);
      
      console.log('Ejecutando cierre semanal único...');

      const ayer = new Date();
      ayer.setDate(hoy.getDate() - 1); // Calcula la fecha exacta de ayer (Domingo de cierre de ciclo)
      const ayerStr = ayer.toLocaleDateString(); // Obtiene la clave string asociada al domingo
      
      // Recupera el listado de ingestas del domingo y comprueba mediante una función flecha si existe el registro de la 'Cena'
      const diarioAyer = this.getDiarioPorFecha(ayerStr);
      if (diarioAyer.some(c => c.momento === 'Cena')) {
        this.ejecutarCierreDeSemana(); // Si se cumple la condición, consolida de forma definitiva el informe semanal
      } else {
        // Si falta la cena, remueve la marca de bloqueo para dar margen a que el atleta abra la app más tarde y anote su cena atrasada sin perder el ciclo
        localStorage.removeItem('ultimo_cierre_auto');
        console.log('Cierre cancelado: falta registro de cena ayer.');
      }
    }
  }

  // ============================================
  //     MÉTODOS PARA EL MÓDULO DE EJERCICIOS
  // ============================================
  
  // Método que consume el repositorio JSON que contiene la biblioteca de fuerza y pesas.
  async cargarEjerciciosRemote() {
    try {
      this.listaEjercicios = await firstValueFrom(this.http.get<any[]>(this.URL_EJERCICIOS));
      console.log("Ejercicios cargados desde GitHub:", this.listaEjercicios.length);
    } catch (error) {
      console.error("Error descargando ejercicios", error); // Captura excepciones físicas de timeout de red
    }
  }
  
  // Método que garantiza la entrega de musculación a la vista de entrenamiento.
  async getEjerciciosAsync() {
    if (this.listaEjercicios.length === 0) {
      await this.cargarEjerciciosRemote(); // Bloquea la entrega de forma controlada hasta finalizar la descarga remota
    }
    return this.listaEjercicios;
  }
  
  // Método que guarda el mapa indexado completo de entrenamientos del gimnasio convirtiéndolo en String.
  private guardarEntrenosEnMemoria() {
    localStorage.setItem('perfectBody_entrenos', JSON.stringify(this.historialEntrenos));
  }

  // Método que carga el mapa asociativo de series de gimnasio desde el almacenamiento
  private cargarEntrenosDesdeMemoria() {
    const datos = localStorage.getItem('perfectBody_entrenos');
    if (datos) this.historialEntrenos = JSON.parse(datos);
  }
  
  // Método que registra una sesión transaccional de series completadas dentro de la clave de su fecha correspondiente.
  guardarSesionEntreno(sesion: any) {
    const fecha = sesion.fecha; // Extrae la clave de fecha (dd/mm/aaaa) vinculada al entrenamiento
    // Si la clave de fecha se encuentra vacía, instancia un array estructural para alojar los bloques de ejercicios
    if (!this.historialEntrenos[fecha]) {
      this.historialEntrenos[fecha] = [];
    }
    this.historialEntrenos[fecha].push(sesion); // Añade el objeto complejo de marcas a la colección del día
    this.guardarEntrenosEnMemoria(); // Vuelca y congela el nuevo estado en el LocalStorage
    console.log('Entrenamiento guardado con éxito para:', fecha);
  }

  getEjercicios() {
    return this.listaEjercicios;
  }

  getHistorialEntrenos() {
    return this.historialEntrenos;
  }
  
  // Método que elimina un bloque de ejercicio basándose en su ID numérico y limpia la persistencia local de la app.
  eliminarEntreno(id: number, fecha: string) {
    if (this.historialEntrenos[fecha]) {
      // Filtra y reconstruye la colección del día excluyendo estrictamente la marca destruida por el usuario
      this.historialEntrenos[fecha] = this.historialEntrenos[fecha].filter(e => e.id !== id);
      this.guardarEntrenosEnMemoria(); // Sincroniza y salva la mutación en la memoria a largo plazo
    }
  }

  // =============================================================
  //     MÉTODOS PARA CONECTAR EL PROGRESO CON LOS DATOS AÑADIDOS
  // =============================================================

  // Método que extrae la masa corporal para gráficos
  getHistorialPeso(): any[] {
    const perfil = this.obtenerPerfil();
    if (perfil && perfil.peso) {
      // Captura la estampa cronológica actual en formato string regional de dos dígitos (dd/mm) para limpiar las etiquetas de la gráfica
      const hoyStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      // Retorna una estructura de simulación de punto de anclaje estable en base al peso real salvado en el formulario
      return [{ fecha: hoyStr, valor: Number(perfil.peso) }];
    }
    return []; // Retorna un array vacío de seguridad si el usuario aún no ha iniciado su perfil corporal
  }

  // Método que calcula de forma milimétrica la distancia de días respecto al huso del terminal para armar una matriz de 7 posiciones
  getKcalSemanales(): number[] {
    const kcalDeLaSemana: number[] = []; // Inicialización de la matriz colectora
    const hoy = new Date();

    // Bucle indexado estricto de 7 pasos correspondientes a la ventana de la semana del calendario deportivo
    for (let i = 0; i < 7; i++) {
      const fechaCalculada = new Date();
      // Evalúa de forma condicional si hoy es domingo (0) para restarle 6 días, o calcula el desfase respecto al lunes (hoy.getDay() - 1)
      const distance = i - (hoy.getDay() === 0 ? 6 : hoy.getDay() - 1);
      fechaCalculada.setDate(hoy.getDate() + distance); // Desplaza el calendario del objeto Date hacia atrás o adelante de la semana
      
      const fechaStr = fechaCalculada.toLocaleDateString(); // Obtiene la firma de consulta string (dd/mm/aaaa)
      const totalesDia = this.getTotalesPorFecha(fechaStr); // Ejecuta la consolidación calórica de esa fecha específica
      
      kcalDeLaSemana.push(totalesDia.kcal || 0); // Inyecta las calorías reales acumuladas en la posición ordinal de la semana (0=Lun, 6=Dom)
    }
    return kcalDeLaSemana;
  }

  // Método que resupera el Metabolismo Basal calculado por el Perfil
  getMetabolismoBasal(): number {
    const objetivo = this.getObjetivoKcal();
    return objetivo > 0 ? objetivo : 1800; // Mecanismo de protección visual para evitar gráficos de escala cero si el usuario no rellenó el perfil
  }

  // =======================================
  //     MÉTODOS PARA EL MÓDULO DE RECETAS
  // =======================================
  
  // Método que incorpora un bloque de contingencia estricto
  async cargarRecetasRemote() {
    try {
      this.listaRecetas = await firstValueFrom(this.http.get<any[]>(this.URL_RECETAS));
      console.log("Recetas cargadas con éxito:", this.listaRecetas.length);
    } catch (error) {
      console.error("Error descargando recetas, cargando backup local...", error);
      // BACKUP ESTÁTICO DE EMERGENCIA (FALLBACK INTEGRITY): Garantiza que el usuario explore contenido aun sin conexión
      this.listaRecetas = [
        { id: "r1", nombre: "Tortitas Pro", kcal: 380, protes: 30, carbos: 45, grasas: 6, momento: "Desayuno" },
        { id: "r2", nombre: "Salmón con Arroz", kcal: 610, protes: 42, carbos: 50, grasas: 22, momento: "Cena" }
      ];
    }
  }

  // Método que garantiza la entrega asíncrona de las recetas fitness
  async getRecetasAsync() {
    if (this.listaRecetas.length === 0) {
      await this.cargarRecetasRemote();
    }
    return this.listaRecetas;
  }
  
  // Método que inyecta un objeto de receta completo en el diario de nutrición de la fecha en curso.
  añadirRecetaAlDiario(receta: any, fecha: string) {
    this.agregarAlDiario(receta, fecha); // Reutiliza la lógica robusta centralizada de inyección nutricional del Single Source of Truth
  }

  // =======================================
  //     MÉTODOS PARA EL MÓDULO DE RECETAS
  // =======================================
  
  // Método que compara en tiempo real las variables globales guardadas contra criterios fijos para desbloquear las medallas brillantes.
  getLogrosUsuario(): any[] {
    const perfil = this.obtenerPerfil(); // Recupera el estado actual del perfil del atleta
    const hoyStr = new Date().toLocaleDateString();
    const totalesHoy = this.getTotalesPorFecha(hoyStr); // Recupera los sumatorios calóricos reales acumulados en el día de hoy
    const semanas = this.getSemanas(); // Recupera la colección de informes semanales cerrados

    return [
      {
        id: 'logro_perfil',
        titulo: 'Primera Piedra',
        descripcion: 'Configurar tus datos iniciales en el perfil.',
        icono: 'trophy-outline',
        color: '#7cf6f6', // Paleta acento Aqua premium corporativa
        // El operador de doble negación (!!) fuerza el casteo estricto a true si el objeto y el peso existen
        activo: !!(perfil && perfil.peso > 0)
      },
      {
        id: 'logro_nutricion',
        titulo: 'Carga de Energía',
        descripcion: 'Superar las 1500 kcal registradas en el día de hoy.',
        icono: 'flame-outline',
        color: '#f97316', // Paleta acento Naranja Fuego de alta energía
        activo: totalesHoy.kcal >= 1500 // Se activa reactivamente en el momento exacto en que el sumatorio calórico diario supera las 1500 kcal
      },
      {
        id: 'logro_constancia',
        titulo: 'Atleta Constante',
        descripcion: 'Completar tu primer cierre semanal con éxito.',
        icono: 'shield-checkmark-outline',
        color: '#a855f7', // Paleta acento Violeta Eléctrico de constancia
        activo: semanas.length > 0 // Se desbloquea cuando el array de históricos cerrados automáticos o manuales tiene al menos un registro consolidado
      }
    ];
  }
}