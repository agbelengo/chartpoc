import { TestBed } from '@angular/core/testing';

import { CreditCard } from './credit-card';

describe('CreditCard', () => {
  let service: CreditCard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditCard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
