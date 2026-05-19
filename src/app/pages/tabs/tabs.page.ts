import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barbellOutline, restaurantOutline, personCircleOutline, analyticsOutline, compassOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet],
})
export class TabsPage {
  
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ 
      'restaurant-outline': restaurantOutline, // Pestaña 1: Diario de Nutrición
      'barbell-outline': barbellOutline,       // Pestaña 2: Gimnasio y Fuerza
      'person-circle-outline': personCircleOutline, // Pestaña 5: Perfil y Medallas
      'analytics-outline': analyticsOutline,   // Pestaña 4: Estadísticas de Progreso
      'compass-outline': compassOutline        // Pestaña 3: Explorar Recetas Saludables
    });
  }
}
