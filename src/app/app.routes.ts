import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'intro', // Lo primero que se ve al abrir la App
    pathMatch: 'full',
  },
  {
    path: 'intro',
    loadComponent: () => import('./pages/intro/intro.page').then(m => m.IntroPage),
  },
  {
    path: '', // Esta es la ruta que envuelve a los Tabs
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
    ],
  },
  {
    path: 'historial-semanal',
    loadComponent: () => import('./pages/historial-semanal/historial-semanal.page').then( m => m.HistorialSemanalPage)
  },
];