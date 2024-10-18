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
      id : [null, Validators.required],
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

  CreateProducts(){
    if(this.form.valid) {
      let info : Model_Products = {
        Prod_Id : 0,
        Prod_Nombre: this.form.value.name,
        Prod_Descripcion: this.form.value.description,
        Prod_Medida: this.form.value.medition,
        Prod_Precio: this.form.value.price,
        Und_Id: this.form.value.price
      }

      this.svProductos.post_producto(info).then(data => {
        this.svMsjs.msgExit(`Excelente!`, `${data}!`);
      }, error => {
        this.svMsjs.msgError(`Error`, `No fue posible crear el producto | ${error.status} ${error.statusText}`);
      });
    }
  }

  updateProducts(){}

  deleteProducts(){}
}


