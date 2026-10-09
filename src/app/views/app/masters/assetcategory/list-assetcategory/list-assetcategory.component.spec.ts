import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAssetcategoryComponent } from './list-assetcategory.component';

describe('ListAssetcategoryComponent', () => {
  let component: ListAssetcategoryComponent;
  let fixture: ComponentFixture<ListAssetcategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListAssetcategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAssetcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
