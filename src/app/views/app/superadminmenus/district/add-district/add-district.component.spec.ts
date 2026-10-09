import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddDistrictComponent } from './add-district.component';

describe('AddDistrictComponent', () => {
  let component: AddDistrictComponent;
  let fixture: ComponentFixture<AddDistrictComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDistrictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDistrictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
