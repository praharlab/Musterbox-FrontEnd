import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FnfPenaltyComponent } from './fnf-penalty.component';

describe('FnfPenaltyComponent', () => {
  let component: FnfPenaltyComponent;
  let fixture: ComponentFixture<FnfPenaltyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FnfPenaltyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FnfPenaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
