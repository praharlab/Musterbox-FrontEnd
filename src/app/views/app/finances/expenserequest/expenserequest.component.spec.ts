import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpenserequestComponent } from './expenserequest.component';

describe('ExpenserequestComponent', () => {
  let component: ExpenserequestComponent;
  let fixture: ComponentFixture<ExpenserequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenserequestComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenserequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
