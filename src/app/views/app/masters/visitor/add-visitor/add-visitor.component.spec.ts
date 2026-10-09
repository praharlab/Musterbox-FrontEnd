import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddVisitorComponent } from './add-visitor.component';

describe('AddVisitorComponent', () => {
  let component: AddVisitorComponent;
  let fixture: ComponentFixture<AddVisitorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddVisitorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
