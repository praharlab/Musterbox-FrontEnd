import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddOperationComponent } from './add-operation.component';

describe('AddOperationComponent', () => {
  let component: AddOperationComponent;
  let fixture: ComponentFixture<AddOperationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddOperationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
