import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListOfficeExpAdvanceComponent } from './list-office-exp-advance.component';

describe('ListOfficeExpAdvanceComponent', () => {
  let component: ListOfficeExpAdvanceComponent;
  let fixture: ComponentFixture<ListOfficeExpAdvanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfficeExpAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfficeExpAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
