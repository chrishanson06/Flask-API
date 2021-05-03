import { TestBed } from '@angular/core/testing';

import { VendorGuard } from './vendor.guard';

describe('VendorGuard', () => {
  let guard: VendorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VendorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
