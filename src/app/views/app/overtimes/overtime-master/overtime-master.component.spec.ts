import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OvertimeMasterComponent } from './overtime-master.component';

describe('OvertimeMasterComponent', () => {
  let component: OvertimeMasterComponent;
  let fixture: ComponentFixture<OvertimeMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OvertimeMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
