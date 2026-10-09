import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAuthorizationComponent } from './edit-authorization.component';

describe('EditAuthorizationComponent', () => {
  let component: EditAuthorizationComponent;
  let fixture: ComponentFixture<EditAuthorizationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditAuthorizationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
