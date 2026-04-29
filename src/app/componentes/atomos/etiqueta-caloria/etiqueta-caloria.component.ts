import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-etiqueta-caloria',
  templateUrl: './etiqueta-caloria.component.html',
  styleUrls: ['./etiqueta-caloria.component.scss'],
})

export class EtiquetaCaloriaComponent  implements OnInit {

  @Input() valor: number = 0;

  constructor() { }

  ngOnInit() {}

}
