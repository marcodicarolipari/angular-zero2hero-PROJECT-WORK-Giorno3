import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BankCurrencyPipe } from '../../../../shared/pipes/bank-currency.pipe';

@Component({
  selector: 'app-balance-display',
  standalone: true,
  imports: [BankCurrencyPipe, DatePipe],
  templateUrl: './balance-display.component.html',
  styleUrl: './balance-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceDisplayComponent {
  readonly balance = input.required<number>();
  readonly accountName = input.required<string>();
  readonly lastUpdate = input.required<string>();

  readonly refreshRequested = output<void>();

  onRefresh(): void {
    this.refreshRequested.emit();
  }
}
