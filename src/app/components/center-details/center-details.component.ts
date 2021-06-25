import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CenterModel} from '../../model/center.model';
import { Geolocation } from '@capacitor/geolocation';
@Component({
  selector: 'app-center-details',
  templateUrl: './center-details.component.html',
  styleUrls: ['./center-details.component.scss']
})
export class CenterDetailsComponent implements OnInit {

  @Input() selectedCenter: CenterModel;
  @Output() backBtnEvent: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }
  getColorClass(feeType: string) {
    return feeType === 'Free' ? 'bg-success':'bg-danger';
  }
  getMinAgeLimitBgCls(minAge: number) {
    return minAge === 18 ? 'bg-danger': 'bg-warning text-dark';
  }
  getTimeSlotList(slotTimeList: Array<string>) {
    return slotTimeList && slotTimeList.length ? slotTimeList.map(slot=>slot.trim()
      .replace('-',' to ')):[];
  }
  getTotlaSlotsInfo(totalSlots: number) {
    return totalSlots > 1 ? `${totalSlots} slots available`:`${totalSlots} slot available`;
  }
  async goToGmap() {
    const coordinates = await Geolocation.getCurrentPosition();
    if (coordinates) {
      this.loadGmap(coordinates);
    } else {
      this.loadGmap(null);
    }
  }
  loadGmap(position) {
    let origin = '';
    if(position){
      origin = `${position.coords.latitude},${position.coords.longitude}`;
    }
    let name = this.selectedCenter.name;
    let address = this.selectedCenter.address;
    let district = this.selectedCenter.district_name;
    let state = this.selectedCenter.state_name;
    let gmapUri = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${name} ${address} ${ district} ${ state} &dir_action=navigate&travelmode=driving`;
    let urlEncoded = encodeURI(gmapUri);
    window.open(urlEncoded,'_blank');
  }
  handleErr(err) {
    this.loadGmap(null);
  }
  backBtnClick() {
    this.backBtnEvent.emit();
  }

}
