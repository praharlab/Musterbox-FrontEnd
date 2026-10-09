import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddMailTypeComponent } from './add-mail-type.component';

describe('AddMailTypeComponent', () => {
  let component: AddMailTypeComponent;
  let fixture: ComponentFixture<AddMailTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddMailTypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMailTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
