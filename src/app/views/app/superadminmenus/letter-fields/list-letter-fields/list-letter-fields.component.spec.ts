import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListLetterFieldsComponent } from './list-letter-fields.component';

describe('ListLetterFieldsComponent', () => {
  let component: ListLetterFieldsComponent;
  let fixture: ComponentFixture<ListLetterFieldsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListLetterFieldsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLetterFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
