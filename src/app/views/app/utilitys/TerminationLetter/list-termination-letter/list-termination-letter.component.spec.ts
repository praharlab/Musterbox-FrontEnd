import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListTerminationLetterComponent } from './list-termination-letter.component';

describe('ListTerminationLetterComponent', () => {
  let component: ListTerminationLetterComponent;
  let fixture: ComponentFixture<ListTerminationLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTerminationLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTerminationLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
