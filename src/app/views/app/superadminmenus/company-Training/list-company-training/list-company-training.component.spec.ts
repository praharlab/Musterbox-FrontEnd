import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListCompanyTrainingComponent } from './list-company-training.component';

describe('ListCompanyTrainingComponent', () => {
  let component: ListCompanyTrainingComponent;
  let fixture: ComponentFixture<ListCompanyTrainingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCompanyTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompanyTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
