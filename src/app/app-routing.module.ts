import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { ConditiontaxationComponent } from './conditiontaxation/conditiontaxation.component';
import { TarifComponent } from './tarif/tarif.component';
import { LocaliteComponent } from './localite/localite.component';
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }