import { TestBed, inject } from '@angular/core/testing';

import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionsService]
    });
  });

  it(
    'should be created',
    inject([TransactionsService], (service: TransactionsService) => {
      expect(service).toBeTruthy();
    })
  );
});
