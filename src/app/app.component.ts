import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CowinService } from '../services/cowin.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessagingService } from '../services/messaging.service';
import { CenterModel } from './model/center.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { SlotResultComponent } from './components/slot-result/slot-result.component';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  notificationReceived: any;

  constructor() {

  }



  ngOnInit() {

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      sessionStorage.setItem('fcm-token',token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      //alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        this.notificationReceived = notification;
        const showAlert = async () => {
          await Dialog.alert({
            title: notification.title,
            message: notification.body,
          });
        };
        showAlert();
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        const showAlert = async () => {
          await Dialog.alert({
            title: this.notificationReceived.title,
            message: this.notificationReceived.body,
          });
        };
        showAlert();
      },
    );
  }

}

