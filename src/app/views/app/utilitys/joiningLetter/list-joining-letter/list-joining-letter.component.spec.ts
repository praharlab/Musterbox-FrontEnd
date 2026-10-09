import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListJoiningLetterComponent } from './list-joining-letter.component';

describe('ListJoiningLetterComponent', () => {
  let component: ListJoiningLetterComponent;
  let fixture: ComponentFixture<ListJoiningLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListJoiningLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListJoiningLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
