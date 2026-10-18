import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'summary' },
  {
    path: 'summary',
    title: 'Riepilogo conto',
    loadComponent: () =>
      import('./features/accounts/containers/account-summary-card/account-summary-card.component').then(
        (m) => m.AccountSummaryCardComponent,
      ),
  },
  {
    path: 'movements',
    title: 'Movimenti',
    loadComponent: () =>
      import('./features/accounts/containers/account-movements/account-movements.component').then(
        (m) => m.AccountMovementsComponent,
      ),
  },
  { path: '**', redirectTo: 'summary' },
];
