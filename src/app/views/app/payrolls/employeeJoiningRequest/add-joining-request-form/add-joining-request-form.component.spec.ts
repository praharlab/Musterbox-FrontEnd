import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddJoiningRequestFormComponent } from './add-joining-request-form.component';

describe('AddJoiningRequestFormComponent', () => {
  let component: AddJoiningRequestFormComponent;
  let fixture: ComponentFixture<AddJoiningRequestFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddJoiningRequestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJoiningRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
