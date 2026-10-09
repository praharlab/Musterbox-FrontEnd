import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdultworkersregisterComponent } from './adultworkersregister.component';

describe('AdultworkersregisterComponent', () => {
  let component: AdultworkersregisterComponent;
  let fixture: ComponentFixture<AdultworkersregisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdultworkersregisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdultworkersregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
