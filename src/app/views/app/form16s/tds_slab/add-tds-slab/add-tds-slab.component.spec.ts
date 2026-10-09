import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTdsSlabComponent } from './add-tds-slab.component';

describe('AddTdsSlabComponent', () => {
  let component: AddTdsSlabComponent;
  let fixture: ComponentFixture<AddTdsSlabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddTdsSlabComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTdsSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
