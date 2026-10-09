import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListTdsSubsectionComponent } from './list-tds-subsection.component';

describe('ListTdsSubsectionComponent', () => {
  let component: ListTdsSubsectionComponent;
  let fixture: ComponentFixture<ListTdsSubsectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTdsSubsectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTdsSubsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
