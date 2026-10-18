// app/features/accounts/components/movement-list/movement-list.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
// Con @if/@for/@switch non serve CommonModule per le direttive strutturali.
// Importiamo solo DatePipe per | date:'...' nella lista movimenti.
import { BankCurrencyPipe } from '../../../../shared/pipes/bank-currency.pipe';
import { AccountMovement, MovementType } from '../../models/movement.model';

export type MovementFilter = 'ALL' | 'CREDIT' | 'DEBIT';

@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [DatePipe, BankCurrencyPipe],
  templateUrl: './movement-list.component.html',
  styleUrl: './movement-list.component.scss', // singolare (Angular 17+)
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementListComponent {
  // === SIGNAL-BASED INPUTS (Angular 17.1+) ===
  // Si leggono come Signal: movements(), isLoading(), error()
  // Il figlio NON può mai modificarli — implicitamente readonly
  readonly movements = input<AccountMovement[]>([]); // default: array vuoto
  readonly isLoading = input<boolean>(false);
  readonly error = input<string | null>(null);

  // === SIGNAL-BASED OUTPUT (Angular 17.3+) ===
  // Il padre ascolta con (movementSelected)="onMovementSelected($event)"
  readonly movementSelected = output<AccountMovement>();

  // === UI STATE (locale — non appartiene al padre) ===
  // Il filtro è una scelta UI del figlio: il padre non deve conoscerla
  readonly filter = signal<MovementFilter>('ALL');
  readonly searchText = signal<string>('');

  // === DERIVED VIEW MODEL (computed puro) ===
  // Legge movements() — l'input signal — come dipendenza.
  // Si ricalcola SOLO quando movements() o filter() cambiano.
  // Nessun bisogno di ngOnChanges per "reagire" all'input che cambia.
  readonly filteredMovements = computed(() => {
    const items = this.movements(); // ← legge l'input signal — registra dipendenza
    const active = this.filter();
    const term = this.searchText().trim().toLowerCase();

    // Il tipo del filtro ('CREDIT'/'DEBIT') coincide con il tipo del movimento
    return items.filter(
      (m) =>
        (active === 'ALL' || m.type === (active as MovementType)) &&
        (!term || m.description.toLowerCase().includes(term)),
    );
  });

  // === VIEWCHILD signal-based (Angular 17.2+) ===
  // Riferimento al container della lista (<ul #listContainer>)
  // Si legge come Signal: listContainer() è undefined prima del render
  readonly listContainer =
    viewChild<ElementRef<HTMLUListElement>>('listContainer');

  // Effect: ogni volta che il filtro cambia, scroll la lista in cima
  // Questo è un side effect UI — il posto giusto è effect()
  private readonly _scrollOnFilterChange = effect(() => {
    this.filter(); // legge filter come dipendenza
    // listContainer() può essere undefined se l'ul non è ancora nel DOM (loading/error)
    this.listContainer()?.nativeElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // === HANDLERS ===
  onFilterChange(filter: MovementFilter): void {
    this.filter.set(filter);
  }

  onSearch(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  onSelect(movement: AccountMovement): void {
    // output().emit() — notifica il padre del movimento selezionato
    this.movementSelected.emit(movement);
  }

  // === PUBLIC METHODS (chiamabili dal padre via viewChild) ===
  // Esempio di uso LEGITTIMO di viewChild: il padre può resettare il filtro
  // imperativament — es. quando cambia l'account selezionato nella sidebar
  resetFilter(): void {
    this.filter.set('ALL');
  }
}
