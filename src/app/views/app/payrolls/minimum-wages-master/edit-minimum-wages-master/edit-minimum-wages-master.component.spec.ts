import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditMinimumWagesMasterComponent } from './edit-minimum-wages-master.component';

describe('EditMinimumWagesMasterComponent', () => {
  let component: EditMinimumWagesMasterComponent;
  let fixture: ComponentFixture<EditMinimumWagesMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMinimumWagesMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMinimumWagesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
