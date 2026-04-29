import { TestBed } from '@angular/core/testing';

import { FitAtomic } from './fit-atomic';

describe('FitAtomic', () => {
  let service: FitAtomic;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FitAtomic);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
