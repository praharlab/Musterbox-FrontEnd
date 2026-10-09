import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HrToolkitComponent } from './hr-toolkit.component';

describe('HrToolkitComponent', () => {
  let component: HrToolkitComponent;
  let fixture: ComponentFixture<HrToolkitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HrToolkitComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrToolkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
