import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditJoiningRequestFormComponent } from './edit-joining-request-form.component';

describe('EditJoiningRequestFormComponent', () => {
  let component: EditJoiningRequestFormComponent;
  let fixture: ComponentFixture<EditJoiningRequestFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditJoiningRequestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJoiningRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
