import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListLetterTemplatetypeComponent } from './list-letter-templatetype.component';

describe('ListLetterTemplatetypeComponent', () => {
  let component: ListLetterTemplatetypeComponent;
  let fixture: ComponentFixture<ListLetterTemplatetypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListLetterTemplatetypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLetterTemplatetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
