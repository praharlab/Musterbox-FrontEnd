import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditJoiningLetterComponent } from './edit-joining-letter.component';

describe('EditJoiningLetterComponent', () => {
  let component: EditJoiningLetterComponent;
  let fixture: ComponentFixture<EditJoiningLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditJoiningLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJoiningLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
