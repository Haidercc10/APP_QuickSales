import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LoginComponent } from './login.component';
import { SvUsuariosService } from 'src/app/Services/Usuarios/sv-usuarios.service';
import { SvMsgsService } from 'src/app/Services/Mensajes/sv-msgs.service';
import { SvCriptografiaService } from 'src/app/Services/Criptografia/sv-criptografia.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const usersServiceMock = {
    get_usuario: jasmine.createSpy('get_usuario').and.resolveTo({
      data: { Usu_Nombre: 'Test', Usu_Password: '123456' }
    })
  };
  const msgsServiceMock = {
    msgExit: jasmine.createSpy('msgExit'),
    msgError: jasmine.createSpy('msgError'),
    msgAdv: jasmine.createSpy('msgAdv'),
  };
  const routerMock = {
    navigate: jasmine.createSpy('navigate').and.resolveTo(true)
  };
  const cryptoServiceMock = {
    encrypt: jasmine.createSpy('encrypt').and.callFake((val: string) => 'encrypted_' + val),
    decrypt: jasmine.createSpy('decrypt').and.callFake((val: string) => val.replace('encrypted_', '')),
    hashSHA256: jasmine.createSpy('hashSHA256').and.returnValue('hash123')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: SvUsuariosService, useValue: usersServiceMock },
        { provide: SvMsgsService, useValue: msgsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SvCriptografiaService, useValue: cryptoServiceMock },
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should encrypt password on submit', async () => {
    component.form.patchValue({ id: 1, pass: 'password123' });
    await component.sendData();

    expect(cryptoServiceMock.encrypt).toHaveBeenCalledWith('password123');
  });
});
