import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddWorkingLocationComponent } from './add-working-location.component';

describe('AddWorkingLocationComponent', () => {
  let component: AddWorkingLocationComponent;
  let fixture: ComponentFixture<AddWorkingLocationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddWorkingLocationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkingLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
