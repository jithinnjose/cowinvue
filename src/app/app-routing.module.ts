import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SlotResultComponent} from './components/slot-result/slot-result.component';
import {CenterDetailsComponent} from './components/center-details/center-details.component';
import {CowinMainComponent} from './components/cowin-main/cowin-main.component';
import {CowinHelpComponent} from './components/cowin-help/cowin-help.component';

const routes: Routes = [
  {path:'', component:CowinMainComponent},
  {path:'center-list', component:SlotResultComponent},
  {path:'center-detail', component:CenterDetailsComponent},
  {path:'help', component:CowinHelpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
