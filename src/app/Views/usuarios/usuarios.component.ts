import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Model_Users } from 'src/app/Models/Model_Users';
import { SvMsgsService } from 'src/app/Services/Mensajes/sv-msgs.service';
import { RolesService } from 'src/app/Services/Roles/roles.service';
import { SvUsuariosService } from 'src/app/Services/Usuarios/sv-usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  users : any = [];
  modal : boolean = false;
  form !: FormGroup;
  actionButton : string = `Crear`;
  classButton : string = `btn-danger`;
  iconButton : string = `pi-check-square`;
  load : boolean = false;
  @ViewChild('dt') dt !: Table;
  rols : any = [];

  constructor(private svUsuarios : SvUsuariosService,
    private svMsjs : SvMsgsService,
    private frmBuilder : FormBuilder,
    private svRoles : RolesService,
  ){
    this.initForm();
  }

  //* Función que ejecuta metodosapenas se carga un modulo.
  ngOnInit() {
    this.getRols();
    this.getUsers();
  }

  //*Inicializar formulario
  initForm(){
    this.form = this.frmBuilder.group({
      id : [null],
      name : [null, Validators.required],
      typeDoc : ['CC', Validators.required],
      email : [null, Validators.required],
      phone : [null, Validators.required],
      rol : [null, Validators.required],
    })
  }

  //Función para obtener roles
  getRols = () => this.svRoles.get_roles().then(data => this.rols = data.data);

  //* Función para limpiar campos
  clearFields(){
    this.form.reset();
    this.modal = false;
  }

  applyFilter = ($event : any, campo: any) => this.dt!.filter(($event.target as HTMLInputElement).value, campo, 'contains');


  //*Función que retorna el modelo de usuarios
  dataUsers(){
    let info : Model_Users = {
      Usu_Id: this.form.value.id,
      Usu_Nombre: this.form.value.name,
      Usu_Email: this.form.value.email,
      Usu_Telefono: this.form.value.phone,
      Rol_Id: this.form.value.rol,
      TpDoc_Id: 'CC',
      Usu_Password: '123456'
    }
    return info;
  }

  //*Función para realizar la acción de actualizar o crear usuarios
  actionsModal(action : string){
    action == `Crear` ? this.CreateUsers() : this.updateUsers();
  }

  //*Función para cargar el modal y cambiar clases dependiendo la acción
  loadModal(create : boolean, data? : any){
    this.form.reset();
    this.form.patchValue({ 'typeDoc' : 'CC'});
    this.modal = true;
    this.actionButton = create ? `Crear` : `Actualizar`;
    this.classButton = create ? `btn-danger` : `btn-success`
    this.iconButton = create ? `pi-check-square` : `pi-refresh`
    if (!create) setTimeout(() => { this.loadFieldsToUpdate(data); }, 200);
  }

  //* Función para cargar los campos del usuario a actualizar en el modal
  loadFieldsToUpdate(data : any){
    this.form.patchValue({
      'id' : data.Usu_Id,
      'name' : data.Usu_Nombre,
      'typeDoc' : data.TpDoc_Id,
      'email' : data.Usu_Email,
      'phone' : data.Usu_Telefono,
      'rol' : data.Rol_Id,
    });
  }

  //*Función para obtener todos los usuarios
  getUsers(){
    this.users = [];
    this.svUsuarios.get_usuarios().then(data => {
      this.users = data.data;
      this.users.forEach((x : any) => {
        x.Rol_Nombre = this.rols.find((a: { Rol_Id: any; }) => a.Rol_Id == x.Rol_Id).Rol_Nombre;
      });
      console.log(this.users);
    }, error => {
      this.svMsjs.msgError(`Error`, `No fue posible cargar la lista de usuarios | ${error.status} ${error.statusText}`);
    });
  }

  //*Función para crear usuarios
  CreateUsers(){
    if(this.form.valid) {
      this.svUsuarios.post_usuario(this.dataUsers()).then(data => {
        this.svMsjs.msgExit(`Excelente!`, `${data.data.message}!`);
        this.clearFields();
        this.getUsers();
      }, error => {
        console.log(`${error.response.data.detail[0].msg}`);
        this.svMsjs.msgError(`Error`, `No fue posible crear el usuario | ${error.status} ${error.response.data.detail[0].msg}`);
      });
    } else this.svMsjs.msgAdv(`Advertencia`, `Debe llenar todos los campos!`);
  }

  //*Función para actualizar usuarios
  updateUsers(){
    if(this.form.valid) {
      this.svUsuarios.put_usuario(this.form.value.id, this.dataUsers()).then(data => {
        this.svMsjs.msgExit(`Excelente!`, `${data.data.message}!`);
        this.clearFields();
        this.getUsers();
      }, error => {
        console.log(`${error.response.data.detail}`);
        this.svMsjs.msgError(`Error`, `No fue posible actualizar el usuario | ${error.status} ${error.response.data.detail}`);
      });
    } else this.svMsjs.msgAdv(`Advertencia`, `Debe llenar todos los campos!`);
  }

  //*Función para eliminar usuarios
  deleteUsers(data : any){
    this.svUsuarios.delete_usuario(data.Usu_Id).then(data => {
      this.svMsjs.msgExit(`Excelente!`, `${data.data.message}!`);
      this.getUsers();
    }, error => {
      this.svMsjs.msgError(`Error`, `No fue posible eliminar el usuario | ${error.status} ${error.response.data.detail[0].msg}`);
    })
  }
}
