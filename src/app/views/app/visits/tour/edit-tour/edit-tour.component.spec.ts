import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTourComponent } from './edit-tour.component';

describe('EditTourComponent', () => {
  let component: EditTourComponent;
  let fixture: ComponentFixture<EditTourComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditTourComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
