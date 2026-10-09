import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAssetMasterComponent } from './edit-asset-master.component';

describe('EditAssetMasterComponent', () => {
  let component: EditAssetMasterComponent;
  let fixture: ComponentFixture<EditAssetMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditAssetMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssetMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
