import { TestBed } from '@angular/core/testing';

import { TransactionsService } from './transactions.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(TransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
