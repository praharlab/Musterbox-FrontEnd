import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddPenaltyComponent } from './add-penalty.component';

describe('AddPenaltyComponent', () => {
  let component: AddPenaltyComponent;
  let fixture: ComponentFixture<AddPenaltyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddPenaltyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPenaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
