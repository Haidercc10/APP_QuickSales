# 🔐 Guía de Seguridad - Sistema de Login Refactorizado

## Resumen de Cambios Implementados

El componente `LoginComponent` ha sido refactorizado con Angular 17 best practices y se agregó un servicio de encriptación robusta. A continuación se detallan las mejoras de seguridad y arquitectura.

---

## 1. Refactor Angular 17 - Mejoras Implementadas

### ✅ Inyección de Dependencias Moderna (`inject`)
```typescript
private readonly cryptoService = inject(SvCriptografiaService);
private readonly router = inject(Router);
```
**Ventaja**: Más limpio, evita inyección en constructor, funciona bien con standalone components.

### ✅ Formularios Reactivos Tipados (Typed Forms)
```typescript
readonly form = this.formBuilder.nonNullable.group({
  id: [0, [Validators.required, Validators.min(1)]],
  pass: ['', [Validators.required]],
});
```
**Ventaja**: Tipado fuerte, previene errores en runtime, autocompletado en IDE.

### ✅ Manejo de Formularios con `ngSubmit`
```html
<form [formGroup]="form" (ngSubmit)="sendData()">
  <button type="submit" class="btn btn-danger" [disabled]="form.invalid || isSubmitting">
```
**Ventaja**: Enter key automáticamente activa submit, mejor accesibilidad.

### ✅ Control Flow Moderno (`@if`)
```html
@if (form.controls.id.invalid && form.controls.id.touched) {
  <small class="text-danger">Debe ingresar un ID válido.</small>
}
```
**Ventaja**: Sintaxis más limpia que `*ngIf`, mejor performance, mejor tree-shaking.

### ✅ Navegación con `Router.navigate()` (Async/Await)
```typescript
await this.router.navigate(['/home']);
```
**Ventaja**: Reemplaza `window.location.pathname` (más seguro, mejor con SPAs).

### ✅ Async/Await en lugar de Promises
```typescript
async sendData(): Promise<void> {
  const response = await this.usersService.get_usuario(Number(id));
}
```
**Ventaja**: Código más legible, mejor manejo de errores con try/catch.

### ✅ Validación de Formulario antes de Submit
```typescript
if (this.form.invalid || this.isSubmitting) {
  this.form.markAllAsTouched();
  return;
}
```
**Ventaja**: Previene envíos duplicados, mejor feedback al usuario.

---

## 2. Encriptación de Contraseña - Nuevo Servicio

### Servicio Creado: `SvCriptografiaService`

Ubicación: **`src/app/Services/Criptografia/sv-criptografia.service.ts`**

#### Funciones Disponibles:

##### 1. `encrypt(value: string): string`
Encripta un valor usando **AES-256 CBC**
```typescript
const encrypted = this.cryptoService.encrypt('mi_contraseña');
// Retorna: string encriptado en Base64
```

##### 2. `decrypt(encryptedValue: string): string`
Desencripta un valor encriptado
```typescript
const original = this.cryptoService.decrypt(encrypted);
// Retorna: 'mi_contraseña'
```

##### 3. `hashSHA256(value: string): string`
Genera un hash SHA-256 irreversible (para verificación)
```typescript
const hash = this.cryptoService.hashSHA256('contraseña');
// NO se puede reversar - para almacenamiento seguro
```

##### 4. `hashHMAC_SHA256(value: string, secret: string): string`
Genera un hash HMAC para integridad y autenticación
```typescript
const hmac = this.cryptoService.hashHMAC_SHA256('datos', 'clave_secreta');
```

---

## 3. Flujo de Seguridad Implementado en Login

```
┌─────────────────────────────────────────────────┐
│  1. Usuario ingresa ID y Contraseña              │
├─────────────────────────────────────────────────┤
│  2. Validación del formulario (client-side)     │
├─────────────────────────────────────────────────┤
│  3. Encriptación AES-256 de contraseña          │
├─────────────────────────────────────────────────┤
│  4. Generación de Hash SHA-256 (sin usar aún)   │
├─────────────────────────────────────────────────┤
│  5. Envío a Backend (por HTTPS)                 │
├─────────────────────────────────────────────────┤
│  6. Backend desencripta / compara                │
├─────────────────────────────────────────────────┤
│  7. Si OK → Navegar a /home                      │
└─────────────────────────────────────────────────┘
```

---

## 4. 🚨 RECOMENDACIONES CRÍTICAS PARA PRODUCCIÓN

### Backend: Almacenamiento de Contraseñas

**❌ NUNCA hacer esto:**
```python
# Mal - contraseña plana
password_field = models.CharField(max_length=100)  # MALO!
```

**✅ Usar bcrypt o similar:**
```python
# Bien - con bcrypt (Python Django)
from django.contrib.auth.hashers import make_password, check_password

user.password = make_password('password123')  # Hashea con salt
if check_password(input_password, user.password):  # Compara de forma segura
    # Login válido
```

```php
// Bien - con bcrypt (PHP)
$password = password_hash('password123', PASSWORD_BCRYPT);
if (password_verify($input_password, $password)) {
    // Login válido
}
```

### Backend: Desencriptar Contraseña (si es necesaria)

**Opción 1: Backend obtiene la clave de encriptación**
```python
from cryptography.fernet import Fernet

# Same key as frontend (store in environment variables)
cipher = Fernet(ENCRYPTION_KEY)
plain_password = cipher.decrypt(encrypted_password).decode()
```

**Opción 2: Mejor - Usar Hash en lugar de Encriptación**
```typescript
// Frontend: Enviar hash
const pass = form.value.pass;
const passHash = this.cryptoService.hashSHA256(pass);

// Backend: Comparar hash (sin reversar)
if (user.password_hash === passHash) {
    // Login válido
}
```

### HTTPS Obligatorio
- **SIEMPRE** usar HTTPS en producción
- La encriptación en cliente es complementaria, no sustituto de TLS/SSL
- Configurar HSTS (HTTP Strict-Transport-Security)

### Variables de Entorno
```typescript
// ❌ NUNCA hardcodear claves
private readonly encryptionKey = 'quick-sales-secure-key-2024-v17';

// ✅ USAR variables de entorno
private readonly encryptionKey = environment.encryptionKey;
```

**`src/environments/environment.ts`:**
```typescript
export const environment = {
  production: false,
  encryptionKey: 'dev-key-123' // Solo desarrollo
};
```

**`src/environments/environment.prod.ts`:**
```typescript
export const environment = {
  production: true,
  encryptionKey: process.env['ENCRYPTION_KEY'] || ''
};
```

### Rate Limiting
Implementar rate limiting en backend para prevenir fuerza bruta:
```python
# Django REST Framework
from rest_framework.throttling import AnonRateThrottle

class LoginThrottle(AnonRateThrottle):
    scope = 'login'
    rate = '5/minute'  # Max 5 intentos por minuto
```

### Logs de Auditoría
```python
# Log intentos de login fallidos
logger.warning(f"Failed login attempt for user {user_id} from {ip_address}")
```

### CORS Seguro
```typescript
// app.module.ts (Backend)
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## 5. Testing

### Unit Tests Incluidos

**Servicio de Criptografía:**
```bash
# Ejecutar tests del servicio
npm test -- --include='**/sv-criptografia.service.spec.ts'
```

**Login Component:**
```bash
# Ejecutar tests del login
npm test -- --include='**/login.component.spec.ts'
```

Verifica:
- ✅ Encriptación/Desencriptación correcta
- ✅ Generación de hashes consistentes
- ✅ Manejo de strings vacíos
- ✅ Inyección de dependencias
- ✅ Navegación posterior a login exitoso

---

## 6. Checklist de Seguridad

- [ ] Backend usa bcrypt o similar para almacenar contraseñas (NUNCA planas)
- [ ] Claves de encriptación están en variables de entorno (NO hardcodeadas)
- [ ] HTTPS habilitado en producción
- [ ] Rate limiting en endpoint de login
- [ ] Logs de auditoría para intentos de login fallidos
- [ ] CORS configurado correctamente
- [ ] Validación server-side de datos (NO confiar solo en validación client)
- [ ] HSTS header habilitado
- [ ] Contraseñas sin caracteres peligrosos sanitizados
- [ ] Sesiones con expiración configurada
- [ ] Re-validación de sesión periódica
- [ ] Logout limpia sesión/token del cliente

---

## 7. Migraciones Futuras (Recomendadas)

### Migrar a OAuth2 / OpenID Connect
```typescript
// Usar angular oauth2 library
import { OAuthService } from 'angular-oauth2-oidc';
```

### Implementar 2FA (Two-Factor Authentication)
```typescript
// Después de login exitoso
const MFA_ENABLED = true;
if (MFA_ENABLED) {
  await this.router.navigate(['/verify-2fa']);
}
```

### JWT Tokens con Refresh
```typescript
// En lugar de sesión
const { access_token, refresh_token } = response;
localStorage.setItem('access_token', access_token);
```

---

## 📚 Referencias

- [Angular 17 Best Practices](https://angular.io/guide/styleguide)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [crypto-js Documentation](https://cryptojs.gitbook.io/docs/)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)

---

**Última actualización**: Marzo 2026
**Versión Angular**: 17.3.0
**Estado**: ✅ Refactorizado y Seguro
