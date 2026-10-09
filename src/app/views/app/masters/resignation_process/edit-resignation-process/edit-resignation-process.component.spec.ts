import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditResignationProcessComponent } from './edit-resignation-process.component';

describe('EditResignationProcessComponent', () => {
  let component: EditResignationProcessComponent;
  let fixture: ComponentFixture<EditResignationProcessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditResignationProcessComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditResignationProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
