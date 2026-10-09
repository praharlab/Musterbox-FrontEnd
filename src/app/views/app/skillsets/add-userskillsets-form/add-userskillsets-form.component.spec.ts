import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddUserskillsetsFormComponent } from './add-userskillsets-form.component';

describe('AddUserskillsetsFormComponent', () => {
  let component: AddUserskillsetsFormComponent;
  let fixture: ComponentFixture<AddUserskillsetsFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserskillsetsFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserskillsetsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
