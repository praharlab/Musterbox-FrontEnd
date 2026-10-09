import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OvertimerequestComponent } from './overtimerequest.component';

describe('OvertimerequestComponent', () => {
  let component: OvertimerequestComponent;
  let fixture: ComponentFixture<OvertimerequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OvertimerequestComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
