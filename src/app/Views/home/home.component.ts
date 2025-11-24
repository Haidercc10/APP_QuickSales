import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home',
  standalone : true,
  imports: [HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  items : MenuItem[] | undefined


  ngOnInit(): void {
    this.loadMenu();
  }

  loadMenu(){

  }
}
