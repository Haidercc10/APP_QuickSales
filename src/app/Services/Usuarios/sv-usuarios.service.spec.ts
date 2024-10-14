import { TestBed } from '@angular/core/testing';

import { SvUsuariosService } from './sv-usuarios.service';

describe('SvUsuariosService', () => {
  let service: SvUsuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SvUsuariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
