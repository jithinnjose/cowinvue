import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CowinService} from '../services/cowin.service';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MessagingService} from '../services/messaging.service';
import {CenterModel} from './model/center.model';
import {IDropdownSettings} from 'ng-multiselect-dropdown/multiselect.model';
import {SlotResultComponent} from './components/slot-result/slot-result.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{


  constructor() {

  }



  ngOnInit() {

  }

}

