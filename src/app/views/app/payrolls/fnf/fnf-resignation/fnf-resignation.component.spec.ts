import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FnfResignationComponent } from './fnf-resignation.component';

describe('FnfResignationComponent', () => {
  let component: FnfResignationComponent;
  let fixture: ComponentFixture<FnfResignationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FnfResignationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FnfResignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
