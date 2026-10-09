import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditMygatepassComponent } from './edit-mygatepass.component';

describe('EditMygatepassComponent', () => {
  let component: EditMygatepassComponent;
  let fixture: ComponentFixture<EditMygatepassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditMygatepassComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMygatepassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
