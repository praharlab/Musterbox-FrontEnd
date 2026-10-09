import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Form16reportComponent } from './form16report.component';

describe('Form16reportComponent', () => {
  let component: Form16reportComponent;
  let fixture: ComponentFixture<Form16reportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Form16reportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form16reportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
