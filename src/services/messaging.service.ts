import {Injectable} from '@angular/core';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject(null);
  fcmUrl = "https://fcm.googleapis.com/fcm/send";
  constructor(private angularFireMessaging: AngularFireMessaging, private http: HttpClient) {

  }

  requestPermission() {
    this.angularFireMessaging.requestPermission.subscribe((token) => {
        console.log('requestPermission ',token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }

    );
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        sessionStorage.setItem('messageToken', token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log('new message received. ', payload);
        this.currentMessage.next(payload);
        this.showCustomNotification(payload);
      });
  }

  sendMessage(msgObject:{title: string, message: string}, isApp = true) {
    let authorization = isApp ? 'key=AAAAyRLuWkw:APA91bGa31lKSekzL5STMdxzQlfUWFCMXE5qFjEt0wqzBPsKj87Hkag5eatTPQBr7Ke8c5D8pZs2wdYQjmoLnFM1LuVt7HzNUx2UsonQ_nOufExAnSm0hBrZbWveKYTSIcwIUJJ9C2cc':
      'key=AAAAeDL1mRU:APA91bHsxMf94gS_9XnrtP5DaysjxEGatqr5YRPIa-H4TreboJUNYrWa_s0Llv38s-zdOL9wAg4cuUqKP5yR5KVwSuJYvM386qef8DSYhx2MnJucCc0_6I7hf3LcBBEQ2vPCnMJ5wnti';
    const headers = new HttpHeaders()
      .set('cache-control', 'no-cache')
      .set('content-type', 'application/json')
      .set('Authorization', authorization);

    const body = {
      notification: {
        title: `${msgObject.title}`,
        body: `${msgObject.message}`,
        image:"https://www.cowin.help/assets/images/cowin-badge.png"
      },
      to : `${sessionStorage.getItem('fcm-token')}`
    };

    return this.http
      .post(this.fcmUrl, body, { headers: headers })
      .subscribe(res => res);
  }

  showCustomNotification(payload: any) {
    let data = payload['notification'];
    let title=data['title'];
    let options = {
      body: data['body'],
      icon:"./assets/images/cowin-badge.png",
      badge:"./assets/images/cowin-badge.png",
      image:"./assets/images/notification-image.jpg"
    };
    let notify:Notification = new Notification(title, options);
    notify.onclick = event=>{
      event.preventDefault();
      window.location.href = "https://selfregistration.cowin.gov.in/";
    };
  }
}
