import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CenterModel} from '../../model/center.model';

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
  goToGmap() {
    let lat = this.selectedCenter.lat;
    let lon = this.selectedCenter.long;
  }
  backBtnClick() {
    this.backBtnEvent.emit();
  }

}
