import { TestBed } from '@angular/core/testing';

import { UserFormValueStorageService } from './user-form-value-storage.service';

describe('UserFormValueStorageService', () => {
  let service: UserFormValueStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFormValueStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
