import { TestBed } from '@angular/core/testing';

import { ProfileStatusService } from './profile-status.service';

describe('ProfileStatusService', () => {
  let service: ProfileStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
