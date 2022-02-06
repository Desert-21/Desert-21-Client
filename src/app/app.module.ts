import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { TitleComponent } from './components/common/title/title.component';
import { IconsComponent } from './components/common/icons/icons.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpAddressInterceptor } from './interceptors/http-address-interceptor';
import { ActivateCodeComponent } from './components/activate-code/activate-code.component';
import { BearerTokenService } from './services/bearer-token.service';
import { MenuComponent } from './components/menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    TitleComponent,
    IconsComponent,
    ActivateCodeComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAddressInterceptor,
      multi: true,
    },
    BearerTokenService,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
