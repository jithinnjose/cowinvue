import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SlotResultComponent} from '../slot-result/slot-result.component';
import {IDropdownSettings} from 'ng-multiselect-dropdown/multiselect.model';
import {Subscription} from 'rxjs';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CenterModel} from '../../model/center.model';
import {CowinService} from '../../../services/cowin.service';
import {MessagingService} from '../../../services/messaging.service';
import {DatepickerOptions} from 'ng2-datepicker';
import * as dateFn from 'date-fns';

@Component({
  selector: 'app-cowin-main',
  templateUrl: './cowin-main.component.html',
  styleUrls: ['./cowin-main.component.scss']
})
export class CowinMainComponent implements OnInit, OnDestroy{
  @ViewChild('appResultRef',{read:SlotResultComponent,static:false}) appResultRef:SlotResultComponent;
  selectedVaccines = [];
  showHelpView = false;
  showResultList = false;
  dropdownSettings:IDropdownSettings = {};
  datePickerOptions: DatepickerOptions;
  selectedDateString: string = null;
  get selectedSearchBy(): SearchByType {
    return this._selectedSearchBy;
  }

  set selectedSearchBy(value: SearchByType) {
    this._selectedSearchBy = value;
    this.resetSearchByForm();
    this.isValidated = false;
  }
  get loading(): boolean {
    return this._loading;
  }

  set loading(value: boolean) {
    this._loading = value;
  }
  private _loading = false;
  countDown: any;
  apiTimer: any;
  private _timeOut: number;
  subscriptions: Subscription[] = [];
  title = 'cowinview';
  isValidated = false;
  myForm: FormGroup;
  formBackup: FormGroup;
  private _stateList: {state_id: number, state_name: string} = null;
  private _districtList: DistrictModel[] = null;
  private _slotList: Array<CenterModel> = null;
  slotBackup: Array<CenterModel> = null;
  private _districtList2: DistrictModel[] = null;
  private _districtList3: DistrictModel[] = null;
  timeDelay = 30;
  message;

  audio;
  isMuted = false;
  public searchByType:typeof SearchByType = SearchByType;
  private _selectedSearchBy: SearchByType;

  constructor(private el:ElementRef, private service: CowinService,private cdr: ChangeDetectorRef, private fb: FormBuilder, private messagingService: MessagingService) {
    this.initializeForm();
  }

  get state() {
    return this.myForm.get('state');
  }

  get pincode() {
    return this.myForm.get('pincode');
  }

  get allvaccine() {
    return this.myForm.get('allvaccine');
  }
  get covaxin() {
    return this.myForm.get('covaxin');
  }
  get covishield() {
    return this.myForm.get('covishield');
  }
  get sputnikv() {
    return this.myForm.get('sputnikv');
  }
  get doseType() {
    return this.myForm.get('doseType');
  }

  get districts() {
    return this.myForm.get('districts');
  }

  get date() {
    return this.myForm.get('date');
  }

  get searchInterval() {
    return this.myForm.get('searchInterval');
  }

  set stateList(stateList: any) {
    this._stateList = stateList;
  }
  get stateList(): any {
    return this._stateList;
  }

  get slotList(): Array<CenterModel> {
    return this._slotList;
  }

  set slotList(slotList:Array<CenterModel>) {
    this._slotList = slotList;
  }

  set districtList(value: DistrictModel[]) {
    this._districtList = value;
  }


  get districtList():DistrictModel[] {
    return this._districtList;
  }
  get timeOut(): number {
    return this._timeOut;
  }

  set timeOut(value: number) {
    this._timeOut = value;
  }

  get copyrightYear() {
    return new Date().getFullYear();
  }

  ngOnInit() {this.getStateList();
    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'district_id',
      textField: 'district_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText:'Select State to load districts'
    };
    this.datePickerOptions = {
      minDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      maxDate: dateFn.endOfYear(new Date()),
      minYear: dateFn.getYear(new Date()), // minimum available and selectable year
      maxYear: dateFn.getYear(new Date()), // maximum available and selectable year
      placeholder: '', // placeholder in case date model is null | undefined, example: 'Please pick a date'
      format: 'dd LLLL YYY',
      formatTitle: 'LLLL yyyy',
      formatDays: 'EEEEE',
      firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
      position: 'bottom',
      inputClass: 'form-control form-control-sm w-100 cowin-dp-input',
      calendarClass: 'datepicker-default cowin-datepicker w-100',
      scrollBarColor: '#dfe3e9'
    };
  }

  initializeForm() {
    this.myForm = this.fb.group({
      state: ['', [Validators.required]],
      pincode: ['', [Validators.required,Validators.min(6)]],
      districts: [[], Validators.required],
      date: [new Date(), !Validators.required],
      allvaccine: [true, !Validators.required],
      covaxin: [false, !Validators.required],
      covishield: [false, !Validators.required],
      sputnikv: [false, !Validators.required],
      doseType: ['', !Validators.required],
      ageLimit: ['', !Validators.required],
      selectedVaccine: ['', !Validators.required],
      feeType: ['', !Validators.required],
      searchInterval: [30, !Validators.required]
    });
    this.formBackup = <FormGroup>this.copyFormControl(this.myForm);
    this.selectedSearchBy = SearchByType.DISTRICT;
  }

  copyFormControl(control: AbstractControl) {
    if (control instanceof FormControl) {
      return new FormControl(control.value);
    } else if (control instanceof FormGroup) {
      const copy = new FormGroup({});
      Object.keys(control.controls).forEach(key => {
        copy.addControl(key, this.copyFormControl(control.controls[key]));
      });
      return copy;
    } else if (control instanceof FormArray) {
      const copy = new FormArray([]);
      control.controls.forEach(cntrl => {
        copy.push(this.copyFormControl(cntrl));
      });
      return copy;
    }
  }

  changeState(e) {
    this.clearAllTimeouts();
    this.state.setValue(e.target.value, {
      onlySelf: true
    });
    this.getDistrictList();
    this.districts.setValue([]);
  }

  resetSearchByForm() {
    if(this.selectedSearchBy === SearchByType.PIN) {
      this.myForm.controls['state'].clearValidators();
      this.myForm.controls['state'].updateValueAndValidity();
      this.myForm.controls['districts'].clearValidators();
      this.myForm.controls['districts'].updateValueAndValidity();
      this.myForm.controls['pincode'].setValidators([Validators.required, Validators.min(6)]);
      this.myForm.controls['pincode'].updateValueAndValidity();
    } else if(this.selectedSearchBy === SearchByType.DISTRICT){
      this.myForm.controls['pincode'].clearValidators();
      this.myForm.controls['pincode'].updateValueAndValidity();
      this.myForm.controls['state'].setValidators(Validators.required);
      this.myForm.controls['state'].updateValueAndValidity();
      this.myForm.controls['districts'].setValidators(Validators.required);
      this.myForm.controls['districts'].updateValueAndValidity();
    }
  }

  changeSearchInterval(e) {
    this.timeDelay = Number(e.target.value);
    if(this.myForm.valid && this.isValidated) this.loadSlots();
  }

  changeFilter() {
    this.clearAllTimeouts();
    this.processFilter();
  }

  handleVaccineSelection(key: string) {
    this.selectedVaccines = [];
    if(key === 'allvaccine' && this.myForm.get('allvaccine').value) {
      this.resetAllVaccinesExceptAll();
    }
    if(key !== 'allvaccine' && !this.myForm.get(key).value) {
      setTimeout(()=>{
        this.myForm.controls[key].setValue(false);
      });
    }
    if(key !== 'allvaccine' && this.myForm.get(key).value) this.myForm.controls['allvaccine'].setValue(false);
    this.selectedVaccines = [
      ...(this.myForm.get('covaxin').value ? ['COVAXIN']:[]),
      ...(this.myForm.get('covishield').value ? ['COVISHIELD']:[]),...(this.myForm.get('sputnikv').value ? ['SPUTNIK V']:[])
    ];
    if(this.selectedVaccines?.length === 0) this.myForm.controls['allvaccine'].setValue(true);
    this.processFilter();
  }

  resetAllVaccinesExceptAll() {
    this.myForm.controls['covaxin'].setValue(false);
    this.myForm.controls['covishield'].setValue(false);
    this.myForm.controls['sputnikv'].setValue(false);
  }

  processFilter() {
    this.loading = true;
    let refSlotList = [];
    let selectedAge = this.myForm.get('ageLimit').value;
    let selectedDoseType = this.myForm.get('doseType').value;
    let selectedDoseKey = 'available_capacity_dose1';
    if(selectedDoseType === 'dose2') selectedDoseKey = 'available_capacity_dose2';
    let selectedVaccines = this.selectedVaccines && this.selectedVaccines.length ? [...this.selectedVaccines]:[];
    let feeType = this.myForm.get('feeType').value;
    if(this.slotBackup && this.slotBackup.length) {
      this.slotBackup.forEach(slot=>refSlotList.push(Object.assign({},slot)));
    }
    if(refSlotList && refSlotList.length) {
      this.filterCentersWithFilters(feeType,
        selectedAge, selectedVaccines, selectedDoseType, selectedDoseKey, refSlotList);
    }
    this.loading = false;
  }

  filterCentersWithFilters(feeType, selectedAge, selectedVaccines, selectedDoseType, doseKey, slotList:CenterModel[]) {
    let filteredCenters = feeType ? slotList.filter(slot=>slot.fee_type === feeType): slotList;
    this.slotList = filteredCenters.reduce((filtered, slot)=>{
      slot.sessions = slot.sessions.filter(ses=>{
        //if(this.selectedDateString && ses.date !== this.selectedDateString) return false;
        if(selectedAge && ses.min_age_limit !== Number(selectedAge)) return false;
        if(selectedVaccines && selectedVaccines.length &&
          selectedVaccines.findIndex(vaccine=>vaccine === ses.vaccine) === -1) return false;
        if(selectedDoseType && ses[doseKey] === 0) return false;
        return true;
      });
      if(slot.sessions && slot.sessions.length) {
        filtered = [...filtered, slot];
      }
      return filtered;
    },[]);
  }

  submit() {
    this.isValidated = true;
    if (!this.myForm.valid) {
      return false;
    } else {
      this.loadSlots();
    }
  }

  getStateList(): any {
    this.subscriptions.push(this.service.getStateList().subscribe(data => {
      this.stateList = data.states;
    }));
  }

  getDistrictList(): any {
    this.subscriptions.push(this.service.getDistrictList(Number(this.state.value)).subscribe((data:{districts:DistrictModel[]}) => {
      this.districtList = data.districts;
    }));
  }
  async loadSlots() {
    this.showResultList = true;
    this.loading = true;
    this.slotBackup = [];
    this.slotList = [];
    this.clearAllTimeouts();
    this.unSubscribeAll();

    let selectedDate = this.date.value;

    let selectedDistricts = this.districts.value.map(val=>val.district_id);

    let selectedPinCodes = this.pincode && this.pincode.value?this.pincode.value.split(',').map(pincodeString=> {
      let sanitizedString = pincodeString.replace(/[^0-9]/g, '');
      return sanitizedString.trim();
    }): [];
    await this.sleep(500);
    if(this.selectedSearchBy === SearchByType.DISTRICT) {
      this.subscriptions.push(this.service.getAllSlots(selectedDistricts,selectedDate).subscribe((data:any)=>{
        this.slotList = data && data.length ? [...data.map(dt=>dt)]: [];
        this.slotBackup = [...this.slotList];
        this.processFilter();
        setTimeout(()=>{
          if(this.slotList && this.slotList.length) {
            this.messagingService.sendMessage({title:'Vaccination centers are available',
              message:this.appResultRef.getMessage()});
            // this.messagingService.sendMessage({title:'Vaccination centers are available',
            //   message:this.appResultRef.getMessage()},false);
          }
        });
        this.loading = false;
        this.triggerInterval();
        if(this.slotList && this.slotList.length) {
          this.play();
          this.clearAllTimeouts();
        }
      }, error => {
        this.clearAndRestartSearch();
      }));
    } else {
      this.subscriptions.push(this.service.getAllSlotsByPin(selectedPinCodes, selectedDate).subscribe((data:any)=>{
        this.slotList = data && data.length ? [...data.map(dt=>dt)]: [];
        this.slotBackup = [...this.slotList];
        this.processFilter();
        setTimeout(()=>{
          if(this.slotList && this.slotList.length) {
            this.messagingService.sendMessage({title:'Vaccination centers are available',
              message:this.appResultRef.getMessage()});
            // this.messagingService.sendMessage({title:'Vaccination centers are available',
            //   message:this.appResultRef.getMessage()},false);
          }
        });
        this.loading = false;
        this.triggerInterval();
        if(this.slotList && this.slotList.length) {
          this.play();
          this.clearAllTimeouts();
        }
      }, error => {
        this.clearAndRestartSearch();
      }));
    }
    this.apiTimer = setTimeout(this.loadSlots.bind(this), this.timeDelay * 1000);
  }

  triggerInterval() {
    clearInterval(this.countDown);
    let seconds = this.timeDelay;
    this.countDown = setInterval(()=>{
      seconds--;
      this.timeOut = seconds;
      if(seconds === 0) clearInterval(this.countDown);
    },1000);
  }

  play() {
    if(this.isMuted) return;
    if(this.audio) this.audio.pause();
    this.audio = new Audio('./assets/sounds/vaccine-speech.mp3');
    // 'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
    this.audio.play();
  }

  stopSearch() {
    this.clearAllTimeouts();
    this.audio?.pause();
    this.audio = null;
  }

  clearAndRestartSearch() {
    this.clearAllTimeouts();
    this.unSubscribeAll();
    setTimeout(this.loadSlots.bind(this),15000);
  }

  clearAllTimeouts() {
    if(this.countDown) {
      clearInterval(this.countDown);
      this.countDown = null;
      this.timeOut = 0;
    }
    if(this.apiTimer) {
      clearTimeout(this.apiTimer);
      this.apiTimer = null;
    }
  }

  getMainHeight(navElm, footerElm) {
    return `calc(100% - ${navElm.offsetHeight + footerElm.offsetHeight}px)`;
  }

  getResultHolderHeight(formElm) {
    return `calc(100% - ${formElm.offsetHeight}px)`;
  }

  unSubscribeAll() {
    if(this.subscriptions && this.subscriptions.length)
      this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  onCopyPinCode(e: MouseEvent, copyElement: HTMLInputElement) {
    copyElement.focus();
    copyElement.select();
    document.execCommand("Copy");
    copyElement.blur();
  }

  resetAll(e) {
    e.preventDefault();
    this.isValidated = false;
    this.audio?.pause();
    this.clearAllTimeouts();
    this.unSubscribeAll();
    this.loading = false;
    this.slotList = null;
    this.districtList = null;
    this.selectedVaccines = [];
    this.showHelpView = false;
    this.slotBackup = [];
    this.selectedSearchBy = SearchByType.DISTRICT;
    this.selectedDateString = null;
    this.myForm.reset(this.formBackup.value);
    this.myForm.markAsUntouched();
    this.myForm.markAsPristine();
  }

  muteSound(e) {
    e.preventDefault();
    this.audio?.pause();
    this.audio = null;
    this.isMuted = !this.isMuted;
  }

  selectFindBy(e: MouseEvent, type: SearchByType) {
    this.resetAll(e);
    this.selectedSearchBy = type;
  }
  isPinSelected():boolean {
    return this.selectedSearchBy === SearchByType.PIN;
  }
  ngOnDestroy() {
    this.unSubscribeAll();
  }
  onOpenCenterDetails() {
    this.stopSearch();
  }
  closeHelpView() {
    this.showHelpView = false;
  }
  goToHelp() {
    this.showHelpView = true;
  }
  onBackFromResultView() {
    this.showResultList = false;
    this.stopSearch();
  }
  private sleep(msec: number) {
    return new Promise((resolve) => setTimeout(resolve, msec));
  }
}

export interface DistrictModel {
  "district_id": number;
  "district_name": string;
}

export enum SearchByType {
  PIN= 1,
  DISTRICT=2
}

