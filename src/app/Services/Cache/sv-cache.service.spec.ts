/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';

import { SvCacheService } from './sv-cache.service';

describe('SvCacheService', () => {
  let service: SvCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SvCacheService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save and retrieve the token', () => {
    service.saveToken('test-token-123');
    expect(service.getToken()).toBe('test-token-123');
  });

  it('should return true when token exists', () => {
    service.saveToken('any-token');
    expect(service.hasToken()).toBeTrue();
  });

  it('should remove the token', () => {
    service.saveToken('any-token');
    service.removeToken();
    expect(service.getToken()).toBeNull();
  });
});
