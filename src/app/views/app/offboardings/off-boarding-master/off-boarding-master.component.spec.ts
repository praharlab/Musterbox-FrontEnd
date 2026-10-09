import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OffBoardingMasterComponent } from './off-boarding-master.component';

describe('OffBoardingMasterComponent', () => {
  let component: OffBoardingMasterComponent;
  let fixture: ComponentFixture<OffBoardingMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OffBoardingMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffBoardingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
