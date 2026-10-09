import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListTdsSectionComponent } from './list-tds-section.component';

describe('ListTdsSectionComponent', () => {
  let component: ListTdsSectionComponent;
  let fixture: ComponentFixture<ListTdsSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTdsSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTdsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
