import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTdsSectionComponent } from './edit-tds-section.component';

describe('EditTdsSectionComponent', () => {
  let component: EditTdsSectionComponent;
  let fixture: ComponentFixture<EditTdsSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTdsSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTdsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
