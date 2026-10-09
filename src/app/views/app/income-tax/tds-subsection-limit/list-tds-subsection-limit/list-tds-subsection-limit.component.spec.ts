import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListTdsSubsectionLimitComponent } from './list-tds-subsection-limit.component';

describe('ListTdsSubsectionLimitComponent', () => {
  let component: ListTdsSubsectionLimitComponent;
  let fixture: ComponentFixture<ListTdsSubsectionLimitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTdsSubsectionLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTdsSubsectionLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
