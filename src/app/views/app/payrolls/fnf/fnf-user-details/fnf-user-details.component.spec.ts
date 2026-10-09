import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FnfUserDetailsComponent } from './fnf-user-details.component';

describe('FnfUserDetailsComponent', () => {
  let component: FnfUserDetailsComponent;
  let fixture: ComponentFixture<FnfUserDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FnfUserDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FnfUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
