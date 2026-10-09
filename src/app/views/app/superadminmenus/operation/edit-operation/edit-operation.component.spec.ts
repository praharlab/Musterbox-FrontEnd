import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditOperationComponent } from './edit-operation.component';

describe('EditOperationComponent', () => {
  let component: EditOperationComponent;
  let fixture: ComponentFixture<EditOperationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditOperationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
