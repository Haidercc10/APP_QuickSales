import { Routes } from "@angular/router";
import { HomeComponent } from "./Views/home/home.component";
import { InventarioComponent } from "./Views/inventario/inventario.component";
import { LoginComponent } from "./Views/login/login.component";
import { UsuariosComponent } from "./Views/usuarios/usuarios.component";
import { authGuard } from "./Guards/auth.guard";

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home',      component: HomeComponent,       canActivate: [authGuard] },
    { path: 'productos', component: InventarioComponent, canActivate: [authGuard] },
    { path: 'usuarios',  component: UsuariosComponent,   canActivate: [authGuard] },
]
