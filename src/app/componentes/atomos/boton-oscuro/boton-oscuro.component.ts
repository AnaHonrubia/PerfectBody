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
  isDark = false;
  constructor() { addIcons({ moon, sunny }); }

  toggleTheme() {
    this.isDark = !this.isDark;
    document.body.classList.toggle('dark', this.isDark);
  }
}
