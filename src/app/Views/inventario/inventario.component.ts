import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
    private svMsjs : SvMsgsService
  ){
  }

  ngOnInit() {
    this.getProducts();
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
  }

  updateProducts(){}

  deleteProducts(){}
}


