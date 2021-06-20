import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CenterModel} from '../../model/center.model';

@Component({
  selector: 'app-slot-result',
  templateUrl: './slot-result.component.html',
  styleUrls: ['./slot-result.component.scss']
})
export class SlotResultComponent implements OnInit {
  get userSelectedDate(): Date {
    return this._userSelectedDate;
  }

  @Input()
  set userSelectedDate(value: Date) {
    this._userSelectedDate = value;
    this.createDateList();
  }
  get slotListForUi(): Array<CenterModel> {
    return this._slotListForUi;
  }

  set slotListForUi(value: Array<CenterModel>) {
    this._slotListForUi = value;
    if(value && value.length) {
      this.totalVaccineDose = this.getTotalSlots(value);
    }
    setTimeout(()=>{
      this.el.nativeElement.getElementsByClassName('selfScroll')[0].scrollTop = 2;
    });
  }
  slotListBackup:Array<CenterModel> = [];
  @Input() isMuted:boolean;
  @Input() isLoading:boolean;

  get timeOut(): number {
    return this._timeOut;
  }
  @Input()
  set timeOut(value: number) {
    this._timeOut = value;
  }
  private _timeOut: number;
  @Output() openCenterDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() backEvFromResult: EventEmitter<any> = new EventEmitter<any>();
  @Output() refreshSearchResult: EventEmitter<any> = new EventEmitter<any>();
  @Output() muteAlert: EventEmitter<any> = new EventEmitter<any>();
  availableDateList: Array<{date: string,dateString:string, month: string}> = [];
  selectedDate: string;
  private _userSelectedDate: Date;
  selectedCenter: CenterModel;
  showCenterDetail = false;
  @Output() dateFilterChange: EventEmitter<string> = new EventEmitter<string>();
  get slotList(): Array<CenterModel> {
    return this._slotList;
  }
  @Input()
  set slotList(slotList: Array<CenterModel>) {
    this._slotList = slotList;
    this.handleSlotValueChange();
  }
  private _slotList:Array<CenterModel> = [];
  private _slotListForUi:Array<CenterModel> = [];
  private _totalVaccineDose;
  get totalVaccineDose() {
    return this._totalVaccineDose;
  }

  set totalVaccineDose(value) {
    this._totalVaccineDose = value;
  }
  constructor(private el:ElementRef) { }

  ngOnInit(): void {
    // this.createDateList();
  }
  handleSlotValueChange() {
    if(this.slotList && this.slotList.length) {
      this.slotListBackup = [];
      this.slotList.forEach(slot=>this.slotListBackup.push(Object.assign({},slot)));
      this.slotListForUi = [...this.slotListBackup];
      this.selectedDate = this.slotListForUi[0].sessions[0].date;
      this.filterByDateSelected(this.selectedDate);
    }
  }

  createDateList() {
    this.availableDateList = [];
    let listLength = 7;
    let dateNow = this.userSelectedDate || new Date();
    let fullYear = dateNow.getFullYear();
    let month = ("0" + (dateNow.getMonth() + 1)).slice(-2);
    let dateDigit = ("0" + dateNow.getDate()).slice(-2);
    let date = `${dateDigit}-${month}-${fullYear}`;
    for(let i=0; i<listLength; i++) {
      let displayDateObj = this.getDateFromDateObj(dateNow,i);
      let calculatedDate = ("0" + displayDateObj.getDate()).slice(-2);//(Number(dateDigit) + i).toString();
      let calculatedMonth = ("0" + (displayDateObj.getMonth() + 1)).slice(-2);
      let calculatedMonthString = displayDateObj.toLocaleString('default', { month: 'short' });
      let calculatedDateString = `${calculatedDate}-${calculatedMonth}-${fullYear}`;
      this.availableDateList.push({
        dateString: calculatedDateString,
        date: calculatedDate,
        month: calculatedMonthString
      });
    }
    this.selectedDate = date;
  }

  filterByDateSelected(dateString: string) {
    this.selectedDate = dateString;
    if(this.slotListBackup.length === 0) return;
    this.isLoading = true;
    let refSlotList = [];
    this.slotListBackup.forEach(slot=>refSlotList.push(Object.assign({},slot)));
    let slotList = refSlotList.reduce((filtered, slot)=>{
      slot.sessions = slot.sessions.filter(dt=>dt.date === this.selectedDate);
      if(slot.sessions && slot.sessions.length) {
        if(slot.sessions.length > 1) {
          slot.sessions.forEach((ses, index)=>{
            let slotCopy = Object.assign({},slot);
            slotCopy.sessions = [ses];
            filtered = [...filtered, slotCopy];
          });
        } else   filtered = [...filtered, slot];
      }
      return filtered;
    },[]);
    this.slotListForUi = slotList;
    this.isLoading = false;
  }
  getCustomClass(index, dateString) {
    let cls;
    if(index === 0) {
      cls = 'me-1';
    } else if(index === this.availableDateList.length - 1) {
      cls = 'ms-1';
    } else {
      cls = 'me-1 ms-1';
    }
    if(this.selectedDate === dateString) {
      cls+=' active btn-primary';
    }
    return cls;
  }
  getMessage() {
    let slotMsg = this.slotListForUi.length === 1 ? 'Center is': 'Centers are';
    let doseMsg = this.totalVaccineDose === 1 ? 'vaccine': 'vaccines';
    return `${this.slotListForUi.length} ${slotMsg} available with ${this.totalVaccineDose} dose of ${doseMsg}`;
  }
  getFeeTypeBgCls(feeType: string) {
    return feeType === 'Free' ? 'bg-success': 'bg-danger';
  }
  getMinAgeLimitBgCls(minAge: number) {
    return minAge === 18 ? 'bg-danger': 'bg-warning text-dark';
  }
  getClassForDose(availableDose:number) {
    if(availableDose <= 5) return 'text-danger';
    if(availableDose >5 && availableDose < 25) return 'text-warning';
    else return 'text-success';
  }
  selectCenter(e:MouseEvent, selectedCenter:CenterModel) {
    this.selectedCenter = selectedCenter;
    this.openCenterDetails.emit();
    this.showCenterDetail = true;
  }
  onBackClick() {
    this.showCenterDetail = false;
  }
  getTotalSlots(slotList) {
    let totalCount = slotList.reduce((acc, element)=>{
      let count = element.sessions.reduce((tot,cur)=>{
        return tot + cur.available_capacity;
      },0);
      return acc + count;
    },0);
    return totalCount;
  }
  backBtnClick() {
    this.backEvFromResult.emit();
  }
  refreshSearch() {
    this.refreshSearchResult.emit();
  }
  muteSound(e) {
    this.muteAlert.emit(e);
  }

  getDateFromDateObj(dateObj, numDays) {
    let refDate = new Date(dateObj);
    refDate.setDate(refDate.getDate() + numDays);
    return refDate;
  }

}
