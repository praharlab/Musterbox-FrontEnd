import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAssetMasterComponent } from './list-asset-master.component';

describe('ListAssetMasterComponent', () => {
  let component: ListAssetMasterComponent;
  let fixture: ComponentFixture<ListAssetMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListAssetMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAssetMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
