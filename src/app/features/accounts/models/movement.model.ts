// app/features/accounts/models/movement.model.ts

export type MovementType = 'CREDIT' | 'DEBIT';

export interface AccountMovement {
  id: string;
  date: string;           // ISO 8601 — es. "2024-11-15T10:30:00"
  description: string;
  type: MovementType;
  amount: number;         // positivo per entrate, negativo per uscite (DEBIT)
  balanceAfter: number;   // saldo dopo il movimento
}

// Dati mock — in produzione: HttpClient (vedremo nel Giorno 8)
export const MOCK_MOVEMENTS: AccountMovement[] = [
  { id: '1', date: '2024-11-15T10:30:00', description: 'Stipendio Novembre',
    type: 'CREDIT', amount: 2800.00, balanceAfter: 5200.00 },
  { id: '2', date: '2024-11-14T08:15:00', description: 'Affitto',
    type: 'DEBIT', amount: -950.00, balanceAfter: 2400.00 },
  { id: '3', date: '2024-11-13T19:45:00', description: 'Supermercato Esselunga',
    type: 'DEBIT', amount: -87.40, balanceAfter: 3350.00 },
  { id: '4', date: '2024-11-12T11:00:00', description: 'Rimborso spese viaggio',
    type: 'CREDIT', amount: 320.00, balanceAfter: 3437.40 },
  { id: '5', date: '2024-11-10T20:00:00', description: 'Bolletta Enel',
    type: 'DEBIT', amount: -142.00, balanceAfter: 3117.40 },
];