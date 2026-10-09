import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Form16MasterComponent } from './form16-master.component';

describe('Form16MasterComponent', () => {
  let component: Form16MasterComponent;
  let fixture: ComponentFixture<Form16MasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Form16MasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form16MasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
