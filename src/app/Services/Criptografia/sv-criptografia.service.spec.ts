/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';

import { SvCriptografiaService } from './sv-criptografia.service';

describe('SvCriptografiaService', () => {
  let service: SvCriptografiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SvCriptografiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should encrypt and decrypt a string correctly', () => {
    const originalValue = 'secretPassword123';
    const encrypted = service.encrypt(originalValue);
    const decrypted = service.decrypt(encrypted);

    expect(encrypted).not.toEqual(originalValue);
    expect(decrypted).toEqual(originalValue);
  });

  it('should handle empty strings', () => {
    expect(service.encrypt('')).toEqual('');
    expect(service.decrypt('')).toEqual('');
  });

  it('should generate consistent hash for same input', () => {
    const value = 'testValue';
    const hash1 = service.hashSHA256(value);
    const hash2 = service.hashSHA256(value);

    expect(hash1).toEqual(hash2);
  });

  it('should generate different hashes for different inputs', () => {
    const hash1 = service.hashSHA256('password1');
    const hash2 = service.hashSHA256('password2');

    expect(hash1).not.toEqual(hash2);
  });

  it('should generate HMAC-SHA256 correctly', () => {
    const value = 'testValue';
    const secret = 'secretKey';
    const hmac = service.hashHMAC_SHA256(value, secret);

    expect(hmac).toBeTruthy();
    expect(hmac.length).toBeGreaterThan(0);
  });
});
