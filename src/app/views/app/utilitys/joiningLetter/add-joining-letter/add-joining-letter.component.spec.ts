import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddJoiningLetterComponent } from './add-joining-letter.component';

describe('AddJoiningLetterComponent', () => {
  let component: AddJoiningLetterComponent;
  let fixture: ComponentFixture<AddJoiningLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddJoiningLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJoiningLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
