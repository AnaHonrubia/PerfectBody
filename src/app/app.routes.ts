import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'nutricion',
        loadComponent: () => import('./pages/nutricion/nutricion.page').then((m) => m.NutricionPage),
      },
      {
        path: 'entrenamiento',
        loadComponent: () => import('./pages/entrenamiento/entrenamiento.page').then((m) => m.EntrenamientoPage),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
      },
      {
        path: '',
        redirectTo: '/nutricion',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/nutricion',
    pathMatch: 'full',
  },
];