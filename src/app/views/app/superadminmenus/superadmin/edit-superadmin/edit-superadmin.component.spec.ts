import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditSuperadminComponent } from './edit-superadmin.component';

describe('EditSuperadminComponent', () => {
  let component: EditSuperadminComponent;
  let fixture: ComponentFixture<EditSuperadminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditSuperadminComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSuperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
