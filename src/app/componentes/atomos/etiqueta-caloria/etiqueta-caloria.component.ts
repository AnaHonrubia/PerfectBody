import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-etiqueta-caloria',
  templateUrl: './etiqueta-caloria.component.html',
  styleUrls: ['./etiqueta-caloria.component.scss'],
})

export class EtiquetaCaloriaComponent implements OnInit {

  // Propiedad de entrada (Decorador @Input) que permite al componente padre inyectar las calorías de cada alimento
  @Input() valor: number = 0;

  constructor() { }

  // Método del ciclo de vida de Angular que se ejecuta tras inicializarse las propiedades de entrada del componente
  ngOnInit() {}

}
