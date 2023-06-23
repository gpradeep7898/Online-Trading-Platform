import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TradeComponent } from './trade/trade.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

import { StockService } from './services/stock.service';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    TradeComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    StockService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
