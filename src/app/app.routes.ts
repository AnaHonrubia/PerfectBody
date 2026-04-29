import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'nutricion',
    loadComponent: () => import('./pages/nutricion/nutricion.page').then( m => m.NutricionPage)
  },
  {
    path: 'entrenamiento',
    loadComponent: () => import('./pages/entrenamiento/entrenamiento.page').then( m => m.EntrenamientoPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
  },
];
