import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

/**
 * Servicio de encriptación AES para proteger datos sensibles en tránsito.
 * 
 * IMPORTANTE: Esta encriptación es para ofuscación en tránsito (HTTPS + AES).
 * El backend DEBE almacenar las contraseñas hasheadas con bcrypt o similar,
 * nunca almacenar contraseñas planas ni solo encriptadas.
 */
@Injectable({ providedIn: 'root' })
export class SvCriptografiaService {
  /**
   * Clave de encriptación (EN PRODUCCIÓN, usar variables de entorno)
   * Esta clave debe ser segura y estar en el backend también si es necesario
   * desencriptar del lado del servidor.
   */
  private readonly encryptionKey = 'quick-sales-secure-key-2024-v17';

  /**
   * Encripta un valor usando AES-256
   * @param value Valor a encriptar
   * @returns Valor encriptado en formato Base64
   */
  encrypt(value: string): string {
    if (!value) {
      return '';
    }
    
    try {
      const encrypted = CryptoJS.AES.encrypt(
        value,
        CryptoJS.enc.Utf8.parse(this.encryptionKey.padEnd(32, ' ').substring(0, 32)),
        {
          iv: CryptoJS.enc.Utf8.parse(this.encryptionKey.substring(0, 16)),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      
      return encrypted.toString();
    } catch (error) {
      console.error('Error during encryption:', error);
      throw new Error('Fallo en la encriptación de datos');
    }
  }

  /**
   * Desencripta un valor usando AES-256
   * @param encryptedValue Valor encriptado en Base64
   * @returns Valor desencriptado
   */
  decrypt(encryptedValue: string): string {
    if (!encryptedValue) {
      return '';
    }

    try {
      const decrypted = CryptoJS.AES.decrypt(
        encryptedValue,
        CryptoJS.enc.Utf8.parse(this.encryptionKey.padEnd(32, ' ').substring(0, 32)),
        {
          iv: CryptoJS.enc.Utf8.parse(this.encryptionKey.substring(0, 16)),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error during decryption:', error);
      throw new Error('Fallo en la desencriptación de datos');
    }
  }

  /**
   * Genera un hash SHA-256 (para verificación sin necesidad de encriptación reversible)
   * @param value Valor a hashear
   * @returns Hash SHA-256 en formato hexadecimal
   */
  hashSHA256(value: string): string {
    if (!value) {
      return '';
    }
    
    return CryptoJS.SHA256(value).toString();
  }

  /**
   * Genera un hash HMAC-SHA256 usando una clave
   * @param value Valor a hashear
   * @param secret Clave secreta para HMAC
   * @returns Hash HMAC-SHA256 en formato hexadecimal
   */
  hashHMAC_SHA256(value: string, secret: string = this.encryptionKey): string {
    if (!value) {
      return '';
    }

    return CryptoJS.HmacSHA256(value, secret).toString();
  }
}
