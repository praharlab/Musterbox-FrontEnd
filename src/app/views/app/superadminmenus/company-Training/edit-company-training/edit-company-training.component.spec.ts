import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditCompanyTrainingComponent } from './edit-company-training.component';

describe('EditCompanyTrainingComponent', () => {
  let component: EditCompanyTrainingComponent;
  let fixture: ComponentFixture<EditCompanyTrainingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCompanyTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
