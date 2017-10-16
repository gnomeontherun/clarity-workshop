import { TestBed, inject } from '@angular/core/testing';

import { UserGuardService } from './user-guard.service';

describe('UserGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserGuardService]
    });
  });

  it(
    'should be created',
    inject([UserGuardService], (service: UserGuardService) => {
      expect(service).toBeTruthy();
    })
  );
});
