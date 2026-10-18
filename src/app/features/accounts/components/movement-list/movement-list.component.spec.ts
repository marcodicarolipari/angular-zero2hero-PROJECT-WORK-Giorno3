import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovementListComponent } from './movement-list.component';
import { AccountMovement } from '../../models/movement.model';

const MOVEMENTS: AccountMovement[] = [
  { id: '1', date: '2024-11-15T10:30:00', description: 'Stipendio Novembre', type: 'CREDIT', amount: 2800, balanceAfter: 5200 },
  { id: '2', date: '2024-11-14T08:15:00', description: 'Affitto', type: 'DEBIT', amount: -950, balanceAfter: 2400 },
  { id: '3', date: '2024-11-13T19:45:00', description: 'Supermercato Esselunga', type: 'DEBIT', amount: -87.4, balanceAfter: 3350 },
  { id: '4', date: '2024-11-12T11:00:00', description: 'Rimborso spese viaggio', type: 'CREDIT', amount: 320, balanceAfter: 3437.4 },
  { id: '5', date: '2024-11-10T20:00:00', description: 'Bolletta Enel', type: 'DEBIT', amount: -142, balanceAfter: 3117.4 },
] as AccountMovement[];

describe('MovementListComponent search', () => {
  let fixture: ComponentFixture<MovementListComponent>;
  let component: MovementListComponent;
  let el: HTMLElement;

  const type = (value: string) => {
    const input = el.querySelector('input') as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };
  const rows = () => el.querySelectorAll('.movements__row');
  const ids = () => component.filteredMovements().map((m) => m.id);

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementListComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.componentRef.setInput('movements', MOVEMENTS);
    fixture.detectChanges();
  });

  it('shows all movements with empty search', () => {
    expect(rows().length).toBe(5);
  });

  it('updates the signal on input event', () => {
    type('affitto');
    expect(component.searchText()).toBe('affitto');
  });

  it('matches description case-insensitively', () => {
    type('SUPERMERCATO');
    expect(ids()).toEqual(['3']);
    expect(rows().length).toBe(1);
  });

  it('matches partial text and multiple results', () => {
    type('s');
    expect(ids()).toEqual(['1', '3', '4']);
  });

  it('trims surrounding spaces', () => {
    type('  enel  ');
    expect(ids()).toEqual(['5']);
  });

  it('does not search in date or amount', () => {
    type('2024');
    expect(ids()).toEqual([]);
    type('950');
    expect(ids()).toEqual([]);
  });

  it('shows "Nessun risultato per la ricerca" when nothing matches', () => {
    type('zzz');
    expect(rows().length).toBe(0);
    expect(el.querySelector('.movements__empty')?.textContent).toContain(
      'Nessun risultato per la ricerca',
    );
  });

  it('combines search with type filter', () => {
    component.onFilterChange('CREDIT');
    type('spese');
    expect(ids()).toEqual(['4']);
    component.onFilterChange('DEBIT');
    expect(ids()).toEqual([]);
  });

  it('restores the list when search is cleared', () => {
    type('zzz');
    type('');
    expect(rows().length).toBe(5);
  });
});
