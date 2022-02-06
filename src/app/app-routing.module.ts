import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivateCodeComponent } from './components/activate-code/activate-code.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { RegistrationComponent } from './components/registration/registration.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'activate-code/:email/:activationCode', component: ActivateCodeComponent },
  { path: 'menu', component: MenuComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
