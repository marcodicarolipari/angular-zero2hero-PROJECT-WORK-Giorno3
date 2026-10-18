export interface AccountSummary {
  name: string;
  balance: number;
  lastUpdate: string; // ISO 8601
}

// Dati mock — in produzione: HttpClient
export const MOCK_ACCOUNT_SUMMARY: AccountSummary = {
  name: 'Conto Principale',
  balance: 12450.0,
  lastUpdate: '2025-03-15T10:30:00',
};
