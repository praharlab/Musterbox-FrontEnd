import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FnfAdvanceComponent } from './fnf-advance.component';

describe('FnfAdvanceComponent', () => {
  let component: FnfAdvanceComponent;
  let fixture: ComponentFixture<FnfAdvanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FnfAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FnfAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
