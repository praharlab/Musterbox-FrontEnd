import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditMailTypeComponent } from './edit-mail-type.component';

describe('EditMailTypeComponent', () => {
  let component: EditMailTypeComponent;
  let fixture: ComponentFixture<EditMailTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditMailTypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMailTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
