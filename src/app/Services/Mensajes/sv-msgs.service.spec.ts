import { TestBed } from '@angular/core/testing';

import { SvMsgsService } from './sv-msgs.service';

describe('SvMsgsService', () => {
  let service: SvMsgsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SvMsgsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
