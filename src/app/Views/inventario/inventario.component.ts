import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Model_Products } from 'src/app/Models/Products/Model_Products';
import { SvMsgsService } from 'src/app/Services/Mensajes/sv-msgs.service';
import { ProductosService } from 'src/app/Services/Productos/productos.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  products : any = [];
  modal : boolean = false;
  form !: FormGroup;
  units : any = [{ Und_Id : 'UND' }];
  actionButton : string = `Crear`;
  classButton : string = `btn-danger`;
  iconButton : string = `pi-check-square`;

  constructor(private svProductos : ProductosService,
    private svMsjs : SvMsgsService,
    private frmBuilder : FormBuilder
  ){
    this.initForm();
  }

  ngOnInit() {
    this.getProducts();
  }

  initForm(){
    this.form = this.frmBuilder.group({
      id : [null],
      name : [null, Validators.required],
      description : [null, Validators.required],
      medition : [null, Validators.required],
      price : [null, Validators.required],
      unit : [null, Validators.required],
    })
  }

  getProducts(){
    this.products = [];
    this.svProductos.get_productos().then(data => {
      this.products = data.data;
    }, error => {
      this.svMsjs.msgError(`Error`, `No fue posible cargar la lista de productos | ${error.status} ${error.statusText}`);
    });
  }

  dataProducts(){
    let info : Model_Products = {
      Prod_Id : 0,
      Prod_Nombre: this.form.value.name,
      Prod_Descripcion: this.form.value.description,
      Prod_Medida: this.form.value.medition,
      Prod_Precio: this.form.value.price,
      Und_Id: this.form.value.unit
    }
    return info;
  }

  actionsModal(action : string){
    action == `Crear` ? this.CreateProducts() : this.updateProducts();
  }

  CreateProducts(){
    if(this.form.valid) {
      this.svProductos.post_producto(this.dataProducts()).then(data => {
        this.svMsjs.msgExit(`Excelente!`, `${data.data.message}!`);
        this.clearFields();
        this.getProducts();
      }, error => {
        this.svMsjs.msgError(`Error`, `No fue posible crear el producto | ${error.status} ${error.statusText}`);
      });
    } else this.svMsjs.msgAdv(`Error`, `Debe llenar todos los campos!`);
  }

  clearFields(){
    this.form.reset();
  }

  updateProducts(){
    if(this.form.valid) {
      this.svProductos.put_producto(this.form.value.id, this.dataProducts()).then(data => {
        this.svMsjs.msgExit(`Excelente!`, `${data.data.message}!`);
        this.clearFields();
        this.getProducts();
      }, error => {
        this.svMsjs.msgError(`Error`, `No fue posible actualizar el producto | ${error.status} ${error.statusText}`);
      });
    } else this.svMsjs.msgAdv(`Error`, `Debe llenar todos los campos!`);
  }

  deleteProducts(){}

  loadModal(create : boolean, data? : any){
    this.modal = true;
    this.actionButton = create ? `Crear` : `Actualizar`;
    this.classButton = create ? `btn-danger` : `btn-success`
    this.iconButton = create ? `pi-check-square` : `pi-refresh`
    if (!create) setTimeout(() => { this.loadFieldsToUpdate(data); }, 200);
  }

  loadFieldsToUpdate(data : any){
    console.log(data.data);
    this.form.patchValue({
      'id' : data.Prod_Id,
      'name' : data.Prod_Nombre,
      'description' : data.Prod_Descripcion,
      'medition' : data.Prod_Medida,
      'price' : data.Prod_Precio,
      'unit' : data.Und_Id,
    })
  }
}


