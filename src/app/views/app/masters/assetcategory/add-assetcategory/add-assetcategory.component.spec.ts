import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAssetcategoryComponent } from './add-assetcategory.component';

describe('AddAssetcategoryComponent', () => {
  let component: AddAssetcategoryComponent;
  let fixture: ComponentFixture<AddAssetcategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddAssetcategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
