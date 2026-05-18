import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { playOutline, pauseOutline, refreshOutline } from 'ionicons/icons';

@Component({
  selector: 'app-cronometro',
  templateUrl: './cronometro.component.html',
  styleUrls: ['./cronometro.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CronometroComponent {
  tiempo: number = 60; // Estado numérico que almacena el tiempo de descanso 
  corriendo: boolean = false; // Flag booleano para controlar si el hilo del temporizador está activo o en pausa
  intervalo: any; // Puntero de memoria para almacenar la referencia del setInterval nativo

  constructor(){
    // Registro optimizado de los iconos de control de flujo en el diccionario de Ionic
    addIcons({
      playOutline, pauseOutline, refreshOutline
    });
  }

  // Inicializa la cuenta atrás de alta intensidad y controla el desfase de llamadas y gestiona la API de vibración nativa del terminal.
  iniciar() {
    if (this.corriendo) return; // Evita que se solapen múltiples intervalos si se pulsa varias veces
    this.corriendo = true;
    
    // Asignación de un intervalo asíncrono repetitivo cada segundo
    this.intervalo = setInterval(() => {
      if (this.tiempo > 0) {
        this.tiempo--; // Decremento aritmético del segundo
      } else {
        this.detener(); // Detención automática al llegar a cero
        this.reproducirSonido(); // Alerta sonora de fin de descanso
      }
    }, 1000);

    // Hace vibrar el movil al arrancar la serie s
    if (navigator.vibrate) {
      navigator.vibrate(500); 
    }
  }

  /**
   * Cancela la ejecución recurrente del hilo del temporizador en el motor de JavaScript.
   */
  detener() {
    clearInterval(this.intervalo); // Destruye el intervalo activo usando su puntero
    this.corriendo = false; // Restablece el flag de control de la vista
  }

  /**
   * Resetea el componente a los valores por defecto.
   */
  reiniciar() {
    this.detener();
    this.tiempo = 60; // Restablece el marcador a su estado base estricto
  }

  // Instancia el constructor Audio del navegador para generar una alerta acústica que avise al usuario de que debe arrancar la siguiente serie de ejercicio.
  reproducirSonido() {
    const audio = new Audio('assets/sounds/beep.mp3'); // Ruta local del archivo de audio de producción
    audio.load(); // Fuerza la precarga del archivo binario en la memoria caché del móvil
    audio.play().catch(error => console.log("Error al reproducir sonido:", error)); // Captura excepciones (bloqueos por políticas de privacidad del navegador)
  }
}