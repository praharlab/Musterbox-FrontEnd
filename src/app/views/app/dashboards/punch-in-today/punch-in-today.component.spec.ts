import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PunchInTodayComponent } from './punch-in-today.component';

describe('PunchInTodayComponent', () => {
  let component: PunchInTodayComponent;
  let fixture: ComponentFixture<PunchInTodayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PunchInTodayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PunchInTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
