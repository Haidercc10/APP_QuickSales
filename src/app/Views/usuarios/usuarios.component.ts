import { Component, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Model_Users } from 'src/app/Models/Model_Users';
import { SvMsgsService } from 'src/app/Services/Mensajes/sv-msgs.service';
import { RolesService } from 'src/app/Services/Roles/roles.service';
import { SvUsuariosService } from 'src/app/Services/Usuarios/sv-usuarios.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-usuarios',
  standalone : true,
  imports: [FormsModule, TableModule, DialogModule, ToastModule, ProgressSpinnerModule, DropdownModule, CardModule, ChipModule, DividerModule, HeaderComponent, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
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
  getRols = () => this.svRoles.get_roles().subscribe({
    next: (data) => {
      this.rols = Array.isArray(data) ? data : data?.data ?? [];
    },
    error: (error: HttpErrorResponse) => {
      this.svMsjs.msgError(`Error`, `No fue posible cargar roles | ${error.status} ${error.statusText}`);
    },
  });

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
    this.svUsuarios.get_usuarios().subscribe({
      next: (data) => {
        this.users = Array.isArray(data) ? data : data?.data ?? [];
        this.users.forEach((x : any) => {
          const rol = this.rols.find((a: { Rol_Id: any; }) => a.Rol_Id == x.Rol_Id);
          x.Rol_Nombre = rol?.Rol_Nombre ?? 'N/A';
        });
      },
      error: (error: HttpErrorResponse) => {
        this.svMsjs.msgError(`Error`, `No fue posible cargar la lista de usuarios | ${error.status} ${error.statusText}`);
      },
    });
  }

  //*Función para crear usuarios
  CreateUsers(){
    if(this.form.valid) {
      this.svUsuarios.post_usuario(this.dataUsers()).subscribe({
        next: (data) => {
          const message = data?.message ?? data?.data?.message ?? 'Usuario creado correctamente';
          this.svMsjs.msgExit(`Excelente!`, `${message}!`);
          this.clearFields();
          this.getUsers();
        },
        error: (error: HttpErrorResponse) => {
          const detail = this.getErrorDetail(error);
          this.svMsjs.msgError(`Error`, `No fue posible crear el usuario | ${error.status} ${detail}`);
        },
      });
    } else this.svMsjs.msgAdv(`Advertencia`, `Debe llenar todos los campos!`);
  }

  //*Función para actualizar usuarios
  updateUsers(){
    if(this.form.valid) {
      this.svUsuarios.put_usuario(this.form.value.id, this.dataUsers()).subscribe({
        next: (data) => {
          const message = data?.message ?? data?.data?.message ?? 'Usuario actualizado correctamente';
          this.svMsjs.msgExit(`Excelente!`, `${message}!`);
          this.clearFields();
          this.getUsers();
        },
        error: (error: HttpErrorResponse) => {
          const detail = this.getErrorDetail(error);
          this.svMsjs.msgError(`Error`, `No fue posible actualizar el usuario | ${error.status} ${detail}`);
        },
      });
    } else this.svMsjs.msgAdv(`Advertencia`, `Debe llenar todos los campos!`);
  }

  //*Función para eliminar usuarios
  deleteUsers(data : any){
    this.svUsuarios.delete_usuario(data.Usu_Id).subscribe({
      next: (response) => {
        const message = response?.message ?? response?.data?.message ?? 'Usuario eliminado correctamente';
        this.svMsjs.msgExit(`Excelente!`, `${message}!`);
        this.getUsers();
      },
      error: (error: HttpErrorResponse) => {
        const detail = this.getErrorDetail(error);
        this.svMsjs.msgError(`Error`, `No fue posible eliminar el usuario | ${error.status} ${detail}`);
      },
    });
  }

  private getErrorDetail(error: HttpErrorResponse): string {
    const detail = error?.error?.detail;

    if (Array.isArray(detail) && detail.length > 0) {
      return detail[0]?.msg ?? 'Error inesperado';
    }

    if (typeof detail === 'string') {
      return detail;
    }

    return error.message;
  }
}
