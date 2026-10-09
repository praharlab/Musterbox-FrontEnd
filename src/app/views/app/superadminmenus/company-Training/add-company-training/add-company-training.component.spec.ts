import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddCompanyTrainingComponent } from './add-company-training.component';

describe('AddCompanyTrainingComponent', () => {
  let component: AddCompanyTrainingComponent;
  let fixture: ComponentFixture<AddCompanyTrainingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompanyTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
