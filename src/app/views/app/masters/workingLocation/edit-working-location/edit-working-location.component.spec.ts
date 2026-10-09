import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditWorkingLocationComponent } from './edit-working-location.component';

describe('EditWorkingLocationComponent', () => {
  let component: EditWorkingLocationComponent;
  let fixture: ComponentFixture<EditWorkingLocationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditWorkingLocationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorkingLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
