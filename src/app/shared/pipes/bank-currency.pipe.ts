// app/shared/pipes/bank-currency.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bankCurrency',
  standalone: true,
  // pure: true è il default — pipe pura = stesso input → stesso output, zero side effects
  // Angular può memoizzare le pipe pure: non le ricalcola se l'input non cambia
})
export class BankCurrencyPipe implements PipeTransform {
  transform(
    value: number | null | undefined,
    currency: string = 'EUR',
  ): string {
    // Gestione edge case: valore null/undefined → mostra trattino
    if (value == null) return '—';

    // Intl.NumberFormat: API nativa del browser per formattazione locale
    // 'it-IT': formato italiano (punto migliaia, virgola decimali)
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
}

// Output esempi:
// bankCurrency | 2800    → "€ 2.800,00"
// bankCurrency | -950    → "-€ 950,00"
// bankCurrency | null    → "—"
// bankCurrency:'USD' | 100 → "US$ 100,00"
