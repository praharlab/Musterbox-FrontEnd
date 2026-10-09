import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportAssetMasterComponent } from './import-asset-master.component';

describe('ImportAssetMasterComponent', () => {
  let component: ImportAssetMasterComponent;
  let fixture: ComponentFixture<ImportAssetMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAssetMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAssetMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
