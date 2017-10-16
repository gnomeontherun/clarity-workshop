import { TestBed, inject } from '@angular/core/testing';

import { UserInitService } from './user-init.service';

describe('UserInitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserInitService]
    });
  });

  it(
    'should be created',
    inject([UserInitService], (service: UserInitService) => {
      expect(service).toBeTruthy();
    })
  );
});
