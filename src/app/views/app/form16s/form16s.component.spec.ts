import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Form16sComponent } from './form16s.component';

describe('Form16sComponent', () => {
  let component: Form16sComponent;
  let fixture: ComponentFixture<Form16sComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Form16sComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form16sComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
