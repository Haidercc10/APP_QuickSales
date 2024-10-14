import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SvMsgsService } from 'src/app/Services/Mensajes/sv-msgs.service';
import { SvUsuariosService } from 'src/app/Services/Usuarios/sv-usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form !: FormGroup;

  constructor(private svUsers : SvUsuariosService,
    private frmBuilder : FormBuilder,
    private svMsj : SvMsgsService,
  ){
    this.initForm();
  }

  ngOnInit(){
  }

  initForm(){
    this.form = this.frmBuilder.group({
      id : [null, Validators.required],
      pass : [null, Validators.required],
    })
  }

  sendData(){
    this.svUsers.get_usuario(this.form.value.id).then(data => {
      if(data.data.Usu_Password == this.form.value.pass) {
        this.svMsj.msgExit(`Datos correctos`, `Bienvenido a Quick Sales ${data.data.Usu_Nombre}!`);
        window.location.pathname = '/home';
      }
    }, error => {
      this.svMsj.msgError(`Datos incorrectos`, `No fue posible su acceso a Quick Sales | ${error.status} ${error.statusText}`);
    });
  }
}
