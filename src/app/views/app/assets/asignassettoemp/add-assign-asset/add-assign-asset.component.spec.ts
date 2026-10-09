import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAssignAssetComponent } from './add-assign-asset.component';

describe('AddAssignAssetComponent', () => {
  let component: AddAssignAssetComponent;
  let fixture: ComponentFixture<AddAssignAssetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddAssignAssetComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssignAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
