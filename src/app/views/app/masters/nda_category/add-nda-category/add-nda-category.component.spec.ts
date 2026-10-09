import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddNdaCategoryComponent } from './add-nda-category.component';

describe('AddNdaCategoryComponent', () => {
  let component: AddNdaCategoryComponent;
  let fixture: ComponentFixture<AddNdaCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddNdaCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNdaCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
