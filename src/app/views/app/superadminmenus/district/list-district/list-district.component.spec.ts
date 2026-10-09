import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListDistrictComponent } from './list-district.component';

describe('ListDistrictComponent', () => {
  let component: ListDistrictComponent;
  let fixture: ComponentFixture<ListDistrictComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDistrictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDistrictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
