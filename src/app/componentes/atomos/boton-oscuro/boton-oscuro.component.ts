import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons'; 
import { moon, sunny } from 'ionicons/icons'; 

@Component({
  selector: 'app-boton-oscuro', 
  templateUrl: './boton-oscuro.component.html',
  styleUrls: ['./boton-oscuro.component.scss'],
  standalone: true, 
  imports: [IonicModule]
})
export class BotonOscuroComponent {
  
  // Estado booleano interno que controla si la interfaz se encuentra en modo nocturno o diurno
  isDark = false;

  constructor() { 
    // Registro obligatorio de los iconos vectoriales para que se puedan ver
    addIcons({ moon, sunny }); 
  }

  // Método encargado de alternar el estado del tema visual global. Invierte el flag booleano e interactúa directamente con la raíz del DOM.
  toggleTheme() {
    // Inversión del estado reactivo
    this.isDark = !this.isDark;
    
    // Inyección o remoción de la clase estricta '.dark' en el body de la aplicación.
    document.body.classList.toggle('dark', this.isDark);
  }
}
