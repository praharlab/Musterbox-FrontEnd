import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTdsSlabComponent } from './edit-tds-slab.component';

describe('EditTdsSlabComponent', () => {
  let component: EditTdsSlabComponent;
  let fixture: ComponentFixture<EditTdsSlabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditTdsSlabComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTdsSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
