import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import set = Reflect.set;
import {CenterModel} from '../app/model/center.model';

@Injectable({
  providedIn: 'root'
})
export class CowinService {
  baseUri = 'https://cdn-api.co-vin.in/api/v2';
  constructor(private http: HttpClient) {

  }

  getStateList(): any {
    return this.http.get(`${this.baseUri}/admin/location/states`);
  }

  getDistrictList(state_id: number) {
    return this.http.get(`${this.baseUri}/admin/location/districts/${state_id}`);
  }

  getAllSlots(selectedDistricts:Array<string>, selectedDate: Date) {
    let dateNow= selectedDate || new Date();
    let fullYear = dateNow.getFullYear();
    let month = ("0" + (dateNow.getMonth() + 1)).slice(-2);
    let dateDigit = ("0" + dateNow.getDate()).slice(-2);
    let date = `${dateDigit}-${month}-${fullYear}`;
    let selectedStreamList = selectedDistricts.map(district=>{
      if(district) {
        return this.http.get(`${this.baseUri}/appointment/sessions/public/calendarByDistrict?district_id=${district}&date=${date}`);
      }
    });
    return forkJoin(selectedStreamList).pipe(map((res: any)=>{
      let centersWithAvailableSlots = [];
      if(res && res.length) {
        res.forEach(response=>{
          let centers= response && response.centers;
          let centersWithSlots = centers.filter(center=>{
            return center.sessions && center.sessions.length && (center.sessions.findIndex(session=>session.available_capacity === 0) === -1);
          });
          centersWithAvailableSlots = [...centersWithAvailableSlots,...centersWithSlots];
        });
      }
      return this.sortList(centersWithAvailableSlots);
    }));
  }
  getAllSlotsByPin(selectedPins:Array<string>,selectedDate: Date) {
    let dateNow= selectedDate || new Date();
    let fullYear = dateNow.getFullYear();
    let month = ("0" + (dateNow.getMonth() + 1)).slice(-2);
    let dateDigit = ("0" + dateNow.getDate()).slice(-2);
    let date = `${dateDigit}-${month}-${fullYear}`;
    let selectedStreamList = selectedPins.map(pincode=>{
      if(pincode) {
        return this.http.get(`${this.baseUri}/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${date}`);
      }
    });
    return forkJoin(selectedStreamList).pipe(map((res: any)=>{
      let centersWithAvailableSlots = [];
      if(res && res.length) {
        res.forEach(response=>{
          let centers= response && response.centers;
          let centersWithSlots = centers.filter(center=>{
            return center.sessions && center.sessions.length && (center.sessions.findIndex(session=>session.available_capacity === 0) === -1);
          });
          centersWithAvailableSlots = [...centersWithAvailableSlots,...centersWithSlots];
        });
      }
      return this.sortList(centersWithAvailableSlots);
    }));
  }

  sortList(slotList:CenterModel[]) {
    let initialSorted = slotList.map((slot)=>{
      slot.sessions.sort((a,b)=>{
        return this.getTimeFromDateString(a.date) - this.getTimeFromDateString(b.date);
      });
    });
    initialSorted.sort((sl1:any,sl2:any)=>this.getTimeFromDateString(sl1.sessions[0].date) - this.getTimeFromDateString(sl2.sessions[0].date));
    return slotList;
  }
  getTimeFromDateString(dateString: string) {
    let datePart = dateString.split('-');
    return new Date(`${datePart[1]},${datePart[0]},${datePart[2]}`).getTime();
  }
}
