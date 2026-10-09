import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UtilityMasterComponent } from './utility-master.component';

describe('UtilityMasterComponent', () => {
  let component: UtilityMasterComponent;
  let fixture: ComponentFixture<UtilityMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UtilityMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
