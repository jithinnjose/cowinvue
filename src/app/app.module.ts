import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireMessagingModule} from '@angular/fire/messaging';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from '../environments/environment';
import {MessagingService} from '../services/messaging.service';
import {SlotResultComponent} from './components/slot-result/slot-result.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {CenterDetailsComponent} from './components/center-details/center-details.component';
import {CowinHelpComponent} from './components/cowin-help/cowin-help.component';
import {CowinMainComponent} from './components/cowin-main/cowin-main.component';
import {DatepickerModule} from 'ng2-datepicker';
import {VirtualScrollerModule} from 'ngx-virtual-scroller';

@NgModule({
  declarations: [
    AppComponent,
    SlotResultComponent,
    CenterDetailsComponent,
    CowinHelpComponent,
    CowinMainComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    DatepickerModule,
    VirtualScrollerModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [MessagingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
