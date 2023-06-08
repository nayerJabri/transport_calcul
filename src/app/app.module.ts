import { BrowserModule } from '@angular/platform-browser';  
import { NgModule } from '@angular/core';  
import { AppRoutingModule } from './app-routing.module';  
import { AppComponent } from './app.component';  
import { HttpClientModule } from '@angular/common/http';
import { ClientComponent } from './client/client.component';
import { LocaliteComponent } from './localite/localite.component';
import { ConditiontaxationComponent } from './conditiontaxation/conditiontaxation.component';
import { TarifComponent } from './tarif/tarif.component'; 
import { FormsModule } from '@angular/forms';

@NgModule({  
  declarations: [  
    AppComponent, ClientComponent, LocaliteComponent, ConditiontaxationComponent, TarifComponent, ClientComponent  
  ],  
  imports: [  
    BrowserModule,  
    AppRoutingModule,  
    HttpClientModule,
    FormsModule,
  ],
  providers: [LocaliteComponent, TarifComponent, ConditiontaxationComponent],  
  bootstrap: [AppComponent]  
})  
export class AppModule { } 