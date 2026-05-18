import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-selector-fecha',
  templateUrl: './selector-fecha.component.html',
  styleUrls: ['./selector-fecha.component.scss'],
  standalone: true,
})

export class SelectorFechaComponent implements OnInit {

  // El constructor inicializa el flujo de dependencias nativas en el arranque del componente
  constructor() { }

  /**
   * Método de inicialización nativo del ciclo de vida de Angular (Lifecycle Hook).
   * Se ejecuta inmediatamente después de que el framework haya parseado los datos de entrada del componente.
   */
  ngOnInit() {}

}