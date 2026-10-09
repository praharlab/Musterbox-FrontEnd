import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAssetMasterComponent } from './add-asset-master.component';

describe('AddAssetMasterComponent', () => {
  let component: AddAssetMasterComponent;
  let fixture: ComponentFixture<AddAssetMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddAssetMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
