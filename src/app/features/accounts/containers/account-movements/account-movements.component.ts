// app/features/accounts/containers/account-movements/account-movements.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { AccountMovement, MOCK_MOVEMENTS } from '../../models/movement.model';
import { MovementListComponent } from '../../components/movement-list/movement-list.component';
import { BankCurrencyPipe } from '../../../../shared/pipes/bank-currency.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-account-movements',
  standalone: true,
  // Il padre importa il figlio come dipendenza standalone
  imports: [MovementListComponent, BankCurrencyPipe, DatePipe],
  templateUrl: './account-movements.component.html',
  styleUrl: './account-movements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountMovementsComponent implements OnInit {
  // === DOMAIN STATE (il padre gestisce i dati) ===
  readonly movements = signal<AccountMovement[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // === UI STATE (selezione — il padre controlla il dettaglio) ===
  readonly selectedMovement = signal<AccountMovement | null>(null);

  // === VIEWCHILD signal-based — riferimento al componente figlio ===
  // Nota: viewChild(ComponentClass) cerca nel template il primo <app-movement-list>
  // Non ha bisogno di un #ref se c'è un solo componente di quel tipo nel template.
  // Si legge come Signal: this.movementList() — può essere undefined prima del render
  readonly movementList = viewChild(MovementListComponent);

  ngOnInit(): void {
    this._loadMovements();
  }

  // Handler: il figlio ha emesso un evento (movementSelected)
  // Il padre RICEVE l'evento e DECIDE cosa fare — non il figlio
  onMovementSelected(movement: AccountMovement): void {
    this.selectedMovement.set(movement);
  }

  // Esempio di uso responsabile di viewChild: reset imperativo del filtro figlio
  // Chiamato quando l'utente cambia account (navigazione sidebar)
  onAccountChange(): void {
    this.selectedMovement.set(null);
    // Chiamo il metodo pubblico del figlio tramite viewChild
    // Questo è un side effect UI imperativo — l'unico caso in cui viewChild è giustificato
    this.movementList()?.resetFilter();
  }

  // Ricarica movimenti (es. pull-to-refresh o polling)
  reload(): void {
    this._loadMovements();
  }

  private _loadMovements(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.selectedMovement.set(null);

    // Simula delay HTTP — nel Giorno 8 useremo HttpClient e interceptors reali
    setTimeout(() => {
      try {
        this.movements.set(MOCK_MOVEMENTS);
        this.isLoading.set(false);
      } catch {
        this.error.set('Impossibile caricare i movimenti. Riprova più tardi.');
        this.isLoading.set(false);
      }
    }, 800);
  }
}
