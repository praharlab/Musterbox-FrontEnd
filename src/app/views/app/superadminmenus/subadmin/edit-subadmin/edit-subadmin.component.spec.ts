import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditSubadminComponent } from './edit-subadmin.component';

describe('EditSubadminComponent', () => {
  let component: EditSubadminComponent;
  let fixture: ComponentFixture<EditSubadminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditSubadminComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
