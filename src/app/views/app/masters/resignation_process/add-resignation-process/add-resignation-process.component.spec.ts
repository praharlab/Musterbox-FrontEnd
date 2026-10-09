import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddResignationProcessComponent } from './add-resignation-process.component';

describe('AddResignationProcessComponent', () => {
  let component: AddResignationProcessComponent;
  let fixture: ComponentFixture<AddResignationProcessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddResignationProcessComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddResignationProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
