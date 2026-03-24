/**
 * EJEMPLOS DE USO: Servicio de Criptografía
 * Archivo de referencia para implementar encriptación en otros componentes
 */

import { Component, inject } from '@angular/core';
import { SvCriptografiaService } from './src/app/Services/Criptografia/sv-criptografia.service';

// ============================================
// EJEMPLO 1: Encriptar datos sensibles
// ============================================
export class ExampleEncryptionComponent {
  private readonly cryptoService = inject(SvCriptografiaService);

  encryptUserData(): void {
    const userData = {
      email: 'user@example.com',
      phone: '+1234567890',
      address: '123 Main St'
    };

    // Encriptar cada campo sensible
    const encryptedData = {
      email: this.cryptoService.encrypt(userData.email),
      phone: this.cryptoService.encrypt(userData.phone),
      address: this.cryptoService.encrypt(userData.address)
    };

    console.log('Datos encriptados:', encryptedData);
    // Guardar en localStorage o enviar al backend
    localStorage.setItem('userData', JSON.stringify(encryptedData));
  }

  decryptUserData(): void {
    const stored = localStorage.getItem('userData');
    if (stored) {
      const encryptedData = JSON.parse(stored);

      const decryptedData = {
        email: this.cryptoService.decrypt(encryptedData.email),
        phone: this.cryptoService.decrypt(encryptedData.phone),
        address: this.cryptoService.decrypt(encryptedData.address)
      };

      console.log('Datos desencriptados:', decryptedData);
    }
  }
}

// ============================================
// EJEMPLO 2: Generar hash para verificación
// ============================================
export class ExampleHashComponent {
  private readonly cryptoService = inject(SvCriptografiaService);

  generateFileHash(): void {
    const fileContent = 'Important document content';
    const hash = this.cryptoService.hashSHA256(fileContent);

    console.log('Hash SHA-256:', hash);
    // Usar para verificar integridad
    // Si hash !== fileContent_hash → archivo fue modificado
  }

  verifyDocumentIntegrity(content: string, expectedHash: string): boolean {
    const actualHash = this.cryptoService.hashSHA256(content);
    return actualHash === expectedHash;
  }
}

// ============================================
// EJEMPLO 3: HMAC para autenticación
// ============================================
export class ExampleHMACComponent {
  private readonly cryptoService = inject(SvCriptografiaService);
  private readonly API_SECRET = 'secret-api-key-123';

  generateAuthToken(data: string): string {
    const token = this.cryptoService.hashHMAC_SHA256(data, this.API_SECRET);
    return token;
  }

  verifyAuthToken(data: string, receivedToken: string): boolean {
    const expectedToken = this.cryptoService.hashHMAC_SHA256(data, this.API_SECRET);
    return expectedToken === receivedToken;
  }
}

// ============================================
// EJEMPLO 4: Encriptar formularios completos
// ============================================
import { FormGroup, FormBuilder } from '@angular/forms';

export class ExampleFormEncryptionComponent {
  private readonly cryptoService = inject(SvCriptografiaService);
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    name: [''],
    email: [''],
    ssn: [''], // Social Security Number - muy sensible
    bankAccount: ['']
  });

  submitEncryptedForm(): void {
    if (this.form.valid) {
      const rawValue = this.form.getRawValue();

      // Encriptar campos sensibles
      const encryptedForm = {
        name: rawValue.name, // No sensible
        email: this.cryptoService.encrypt(rawValue.email ?? ''), // Sensible
        ssn: this.cryptoService.encrypt(rawValue.ssn ?? ''), // MUY sensible
        bankAccount: this.cryptoService.encrypt(rawValue.bankAccount ?? '') // MUY sensible
      };

      console.log('Enviando formulario encriptado:', encryptedForm);
      // Enviar al backend
    }
  }

  // Backend recibe y desencripta:
  // const decrypted = {
  //   name: encryptedForm.name,
  //   email: this.cryptoService.decrypt(encryptedForm.email),
  //   ssn: this.cryptoService.decrypt(encryptedForm.ssn),
  //   bankAccount: this.cryptoService.decrypt(encryptedForm.bankAccount)
  // };
}

// ============================================
// EJEMPLO 5: Enum para niveles de seguridad
// ============================================
export enum SecurityLevel {
  PUBLIC = 'public',        // No encriptar
  PRIVATE = 'private',      // Encriptar con AES
  CRITICAL = 'critical',    // Encriptar + Hash
  AUDIT = 'audit'           // Encriptar + HMAC
}

export class ExampleSecurityLevelComponent {
  private readonly cryptoService = inject(SvCriptografiaService);

  processDataBySecurityLevel(data: string, level: SecurityLevel): any {
    switch (level) {
      case SecurityLevel.PUBLIC:
        return data; // Sin encriptación

      case SecurityLevel.PRIVATE:
        return {
          data: this.cryptoService.encrypt(data),
          type: 'encrypted'
        };

      case SecurityLevel.CRITICAL:
        return {
          data: this.cryptoService.encrypt(data),
          hash: this.cryptoService.hashSHA256(data),
          type: 'encrypted_hashed'
        };

      case SecurityLevel.AUDIT:
        return {
          data: this.cryptoService.encrypt(data),
          hmac: this.cryptoService.hashHMAC_SHA256(data),
          type: 'encrypted_hmac'
        };
    }
  }
}

// ============================================
// EJEMPLO 6: Integración con Interceptor
// ============================================
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class EncryptionInterceptor implements HttpInterceptor {
  constructor(private cryptoService: SvCriptografiaService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si la solicitud contiene datos sensibles, encriptar
    if (req.method === 'POST' && req.body?.isSensitive) {
      const encryptedBody = {
        ...req.body,
        payload: this.cryptoService.encrypt(JSON.stringify(req.body.payload))
      };

      req = req.clone({ body: encryptedBody });
    }

    return next.handle(req);
  }
}

// En app.module.ts o providers:
// {
//   provide: HTTP_INTERCEPTORS,
//   useClass: EncryptionInterceptor,
//   multi: true
// }

// ============================================
// EJEMPLO 7: Error handling
// ============================================
export class ExampleErrorHandlingComponent {
  private readonly cryptoService = inject(SvCriptografiaService);

  safeEncrypt(value: string): string {
    try {
      return this.cryptoService.encrypt(value);
    } catch (error) {
      console.error('Error durante encriptación:', error);
      // Fallback: si falla encriptación, al menos validar
      return value; // O lanzar error y detener la operación
    }
  }

  safeDecrypt(encryptedValue: string): string {
    try {
      return this.cryptoService.decrypt(encryptedValue);
    } catch (error) {
      console.error('Error durante desencriptación:', error);
      // No retornar datos sin validar
      throw new Error('No se pudo desencriptar los datos');
    }
  }
}

// ============================================
// EJEMPLO 8: API Service con encriptación
// ============================================
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ExampleApiService {
  private readonly http = inject(HttpClient);
  private readonly cryptoService = inject(SvCriptografiaService);
  private readonly API_URL = 'https://api.example.com/secure';

  updateSensitiveData(data: { email: string; phone: string }): Observable<any> {
    const encryptedData = {
      email: this.cryptoService.encrypt(data.email),
      phone: this.cryptoService.encrypt(data.phone),
      timestamp: Date.now(),
      hmac: '' // Se llena en el backend
    };

    return this.http.post(`${this.API_URL}/update`, encryptedData);
  }

  getSensitiveData(): Observable<any> {
    return this.http.get(`${this.API_URL}/data`);
  }
}

// ============================================
// NOTA IMPORTANTE SOBRE SEGURIDAD
// ============================================
/**
 * ✅ HACER:
 * - Usar HTTPS en producción (obligatorio)
 * - Encriptar datos sensibles en tránsito
 * - Hash de contraseñas en backend (bcrypt, argon2)
 * - Validación server-side de datos
 * - Rate limiting en endpoints sensibles
 * - CORS configurado correctamente
 * - Logs de auditoría
 *
 * ❌ NO HACER:
 * - Almacenar contraseñas planas en la BD
 * - Confiar solo en validación client-side
 * - Hardcodear claves de encriptación
 * - Usar encriptación en lugar de hashing para contraseñas
 * - Exponer claves en requests HTTP sin HTTPS
 * - Almacenar datos sensibles sin encriptar en localStorage
 * - Olvidar validar datos del lado del servidor
 */
