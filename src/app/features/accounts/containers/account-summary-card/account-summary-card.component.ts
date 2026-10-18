import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BalanceDisplayComponent } from '../../components/balance-display/balance-display.component';
import { AccountSummaryService } from '../../services/account-summary.service';
import { AccountSummary } from '../../models/account-summary.model';
import { BankCurrencyPipe } from '../../../../shared/pipes/bank-currency.pipe';

@Component({
  selector: 'app-account-summary-card',
  standalone: true,
  imports: [BalanceDisplayComponent, BankCurrencyPipe],
  templateUrl: './account-summary-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSummaryCardComponent {
  private readonly service = inject(AccountSummaryService);

  readonly summary = signal<AccountSummary>(this.service.getSummary());

  onRefreshRequested(): void {
    console.log('Refresh richiesto per', this.summary().name);
  }
}
