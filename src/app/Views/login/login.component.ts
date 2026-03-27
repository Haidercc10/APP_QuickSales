import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { SvMsgsService } from 'src/app/Services/Mensajes/sv-msgs.service';
import { SvUsuariosService } from 'src/app/Services/Usuarios/sv-usuarios.service';
import { SvCriptografiaService } from 'src/app/Services/Criptografia/sv-criptografia.service';
import { SvLoginService } from 'src/app/Services/Login/sv-login.service';
import { SvCacheService } from 'src/app/Services/Cache/sv-cache.service';

interface UserLoginResponse {
  data: {
    Usu_Nombre: string;
    Usu_Password: string;
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ToastModule, FormsModule, ReactiveFormsModule, DividerModule,],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly usersService = inject(SvUsuariosService);
  private readonly loginService = inject(SvLoginService);
  private readonly cacheService = inject(SvCacheService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messagesService = inject(SvMsgsService);
  private readonly router = inject(Router);
  private readonly cryptoService = inject(SvCriptografiaService);

  readonly form = this.formBuilder.nonNullable.group({
    id: [0, [Validators.required, Validators.min(1)]],
    pass: ['', [Validators.required]],
  });

  isSubmitting = false;

  // Método para enviar datos al backend y manejar la respuesta
  async loginWithEndpoint(): Promise<void> {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      this.messagesService.msgAdv('Advertencia', 'Debe ingresar un ID válido y contraseña.');
      return;
    }

    this.isSubmitting = true;
    const { id, pass } = this.form.getRawValue();

    try {
      const response = await this.loginService.login({ Usu_Id: Number(id), Usu_Password: pass });
      console.log(response);

      const token = response?.data?.token
        ?? response?.data?.access_token
        ?? response?.data?.accessToken
        ?? response?.data?.jwt;

      console.log('Token de login:', token ?? response?.data);

      if (!token) {
        this.messagesService.msgAdv('Login exitoso', 'La API respondió, pero no se encontró un token con una llave conocida. Revise la consola.');
        return;
      }

      this.cacheService.saveToken(token);
      this.messagesService.msgExit('Datos correctos', 'Login exitoso. Sesión iniciada correctamente.');
      await this.router.navigate(['/home']);
    } catch (error: any) {
      const status = error?.status ?? 'N/A';
      const detail = error?.response?.data?.detail ?? error?.detail ?? 'Error inesperado';
      this.messagesService.msgError('Datos incorrectos', `No fue posible su acceso a Quick Sales | ${status} ${detail}`);
    } finally {
      this.isSubmitting = false;
    }
  }

  async sendData(): Promise<void> {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      this.messagesService.msgAdv('Advertencia', 'Debe ingresar un ID válido y contraseña.');
      return;
    }

    this.isSubmitting = true;
    const { id, pass } = this.form.getRawValue();

    try {
      // Encrypt the password before sending/comparing
      const encryptedPass = this.cryptoService.encrypt(pass);
      const passwordHash = this.cryptoService.hashSHA256(pass);

      const response = await this.usersService.get_usuario(Number(id)) as UserLoginResponse;

      // Compare with encrypted password (backend should decrypt and compare)
      // OR compare with hash if backend stores hash instead
      if (response.data.Usu_Password !== pass && response.data.Usu_Password !== encryptedPass) {
        this.messagesService.msgError('Datos incorrectos', 'La contraseña ingresada no es válida.');
        return;
      }

      this.messagesService.msgExit('Datos correctos', `Bienvenido a Quick Sales ${response.data.Usu_Nombre}!`);
      await this.router.navigate(['/home']);
    } catch (error: any) {
      const status = error?.status ?? 'N/A';
      const detail = error?.response?.data?.detail ?? error?.detail ?? 'Error inesperado';
      this.messagesService.msgError('Datos incorrectos', `No fue posible su acceso a Quick Sales | ${status} ${detail}`);
    } finally {
      this.isSubmitting = false;
    }
  }
}
