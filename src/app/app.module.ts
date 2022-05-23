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
import { GameViewComponent } from './components/game-view/game-view.component';
import { AreasComponent } from './components/game-view/areas/areas.component';
import { HeaderComponent } from './components/game-view/header/header.component';
import { SmallTitleComponent } from './components/game-view/header/small-title/small-title.component';
import { TurnTimerButtonComponent } from './components/game-view/header/turn-timer-button/turn-timer-button.component';
import { ResourcesComponent } from './components/game-view/header/resources/resources.component';
import { ButtonsPanelComponent } from './components/game-view/header/buttons-panel/buttons-panel.component';
import { TurnCounterComponent } from './components/game-view/header/turn-counter/turn-counter.component';
import { PlayersNicknamesComponent } from './components/game-view/header/players-nicknames/players-nicknames.component';
import { HttpTokenInterceptor } from './interceptors/token-interceptor';
import { PlayGameComponent } from './components/menu/play-game/play-game.component';
import { HomeComponent } from './components/menu/home/home.component';
import { HowToPlayComponent } from './components/menu/how-to-play/how-to-play.component';
import { AccountComponent } from './components/menu/account/account.component';
import { FieldStylingDirective } from './directives/field-styling.directive';
import { FieldComponent } from './components/game-view/areas/field/field.component';
import { EnlighterDirective } from './directives/enlighter.directive';
import { RightPanelComponent } from './components/game-view/right-panel/right-panel.component';
import { LeftPanelComponent } from './components/game-view/left-panel/left-panel.component';
import { BuildingPreviewComponent } from './components/game-view/right-panel/building-preview/building-preview.component';
import { UpgradeBuildingButtonComponent } from './components/game-view/right-panel/upgrade-building-button/upgrade-building-button.component';
import { PlayersActionsComponent } from './components/game-view/left-panel/players-actions/players-actions.component';
import { ActionEntryComponent } from './components/game-view/left-panel/players-actions/action-entry/action-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    TitleComponent,
    IconsComponent,
    ActivateCodeComponent,
    MenuComponent,
    GameViewComponent,
    AreasComponent,
    HeaderComponent,
    SmallTitleComponent,
    TurnTimerButtonComponent,
    ResourcesComponent,
    ButtonsPanelComponent,
    TurnCounterComponent,
    PlayersNicknamesComponent,
    PlayGameComponent,
    HomeComponent,
    HowToPlayComponent,
    AccountComponent,
    FieldStylingDirective,
    FieldComponent,
    EnlighterDirective,
    RightPanelComponent,
    LeftPanelComponent,
    BuildingPreviewComponent,
    UpgradeBuildingButtonComponent,
    PlayersActionsComponent,
    ActionEntryComponent
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true,
    },
    BearerTokenService,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
