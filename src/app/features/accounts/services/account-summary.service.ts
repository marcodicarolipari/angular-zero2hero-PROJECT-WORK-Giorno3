import { Injectable } from '@angular/core';
import { AccountSummary, MOCK_ACCOUNT_SUMMARY } from '../models/account-summary.model';

@Injectable({ providedIn: 'root' })
export class AccountSummaryService {
  getSummary(): AccountSummary {
    return MOCK_ACCOUNT_SUMMARY;
  }
}
