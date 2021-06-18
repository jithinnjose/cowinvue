import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CowinMainComponent } from './cowin-main.component';

describe('CowinMainComponent', () => {
  let component: CowinMainComponent;
  let fixture: ComponentFixture<CowinMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CowinMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CowinMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
