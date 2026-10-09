import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAssetcategoryComponent } from './edit-assetcategory.component';

describe('EditAssetcategoryComponent', () => {
  let component: EditAssetcategoryComponent;
  let fixture: ComponentFixture<EditAssetcategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditAssetcategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssetcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
