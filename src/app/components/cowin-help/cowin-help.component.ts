import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-cowin-help',
  templateUrl: './cowin-help.component.html',
  styleUrls: ['./cowin-help.component.scss']
})
export class CowinHelpComponent implements OnInit {

  @Output() backBtnEvent: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }
  backBtnClick() {
    this.backBtnEvent.emit();
  }

}
