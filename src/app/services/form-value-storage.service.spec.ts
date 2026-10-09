import { TestBed } from '@angular/core/testing';

import { FormValueStorageService } from './form-value-storage.service';

describe('FormValueStorageService', () => {
  let service: FormValueStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormValueStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
