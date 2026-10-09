import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditProductMasterComponent } from './edit-product-master.component';

describe('EditProductMasterComponent', () => {
  let component: EditProductMasterComponent;
  let fixture: ComponentFixture<EditProductMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditProductMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
