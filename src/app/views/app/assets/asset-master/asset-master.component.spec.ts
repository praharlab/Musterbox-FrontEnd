import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssetMasterComponent } from './asset-master.component';

describe('AssetMasterComponent', () => {
  let component: AssetMasterComponent;
  let fixture: ComponentFixture<AssetMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AssetMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
