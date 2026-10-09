import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTdsSectionComponent } from './add-tds-section.component';

describe('AddTdsSectionComponent', () => {
  let component: AddTdsSectionComponent;
  let fixture: ComponentFixture<AddTdsSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTdsSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTdsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
