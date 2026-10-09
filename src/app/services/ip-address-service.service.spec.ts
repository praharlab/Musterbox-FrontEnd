import { TestBed } from '@angular/core/testing';

import { IpAddressServiceService } from './ip-address-service.service';

describe('IpAddressServiceService', () => {
  let service: IpAddressServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpAddressServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
