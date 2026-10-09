import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListMinimumWagesMasterComponent } from './list-minimum-wages-master.component';

describe('ListMinimumWagesMasterComponent', () => {
  let component: ListMinimumWagesMasterComponent;
  let fixture: ComponentFixture<ListMinimumWagesMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMinimumWagesMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMinimumWagesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
