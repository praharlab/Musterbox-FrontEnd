import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditVisitorComponent } from './edit-visitor.component';

describe('EditVisitorComponent', () => {
  let component: EditVisitorComponent;
  let fixture: ComponentFixture<EditVisitorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditVisitorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
