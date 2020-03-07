import { TestBed } from '@angular/core/testing';

import { P5ManagerService } from './p5-manager.service';

describe('P5ManagerService', () => {
  let service: P5ManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(P5ManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
