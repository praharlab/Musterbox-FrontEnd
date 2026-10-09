import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HrTabComponent } from './hr-tab.component';

describe('HrTabComponent', () => {
  let component: HrTabComponent;
  let fixture: ComponentFixture<HrTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HrTabComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
