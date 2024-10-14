import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  products : any = [];
  modal : boolean = false;

  ngOnInit() {

  }

  getProducts(){}

  CreateProducts(){}

  updateProducts(){}

  deleteProducts(){}
}


