import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportAssetCategoryComponent } from './import-asset-category.component';

describe('ImportAssetCategoryComponent', () => {
  let component: ImportAssetCategoryComponent;
  let fixture: ComponentFixture<ImportAssetCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAssetCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAssetCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
