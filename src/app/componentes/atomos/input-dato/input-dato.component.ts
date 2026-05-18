import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-dato',
  templateUrl: './input-dato.component.html', // Usamos el archivo externo
  styleUrls: ['./input-dato.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})

export class InputDatoComponent {
  // Propiedades de entrada (@Input) para configurar el comportamiento del componente desde el Perfil
  @Input() etiqueta: string = ''; // Texto que aparecerá arriba del campo (ej: 'Peso')
  @Input() tipo: string = 'number'; // Restricción de entrada física (number, text, etc.)
  @Input() placeholder: string = ''; // Mensaje guía flotante dentro del cajón
  @Input() unidad: string = ''; // Sufijo de métrica deportiva (kg, cm, años)
  @Input() valor: any; // El dato primitivo enlazado que viaja entre las vistas
  
  // Nomenclatura Estricta "XChange": Requisito obligatorio en Angular para habilitar el Two-way Data Binding nativo con [(X)]
  @Output() valorChange = new EventEmitter<any>();

  /**
   * Método disparado de forma reactiva cada vez que el usuario teclea un dígito en el móvil.
   * Emite el nuevo estado del dato hacia el componente padre inmediatamente.
   */
  alCambiarValor(event: any) {
    // Captura el valor actual de la propiedad local y la lanza hacia el componente Perfil
    this.valorChange.emit(this.valor);
  }
}