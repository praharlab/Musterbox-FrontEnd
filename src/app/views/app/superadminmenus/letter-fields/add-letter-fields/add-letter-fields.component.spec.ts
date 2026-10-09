import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLetterFieldsComponent } from './add-letter-fields.component';

describe('AddLetterFieldsComponent', () => {
  let component: AddLetterFieldsComponent;
  let fixture: ComponentFixture<AddLetterFieldsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddLetterFieldsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLetterFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
