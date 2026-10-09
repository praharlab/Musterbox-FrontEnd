import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAssignAssetComponent } from './edit-assign-asset.component';

describe('EditAssignAssetComponent', () => {
  let component: EditAssignAssetComponent;
  let fixture: ComponentFixture<EditAssignAssetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditAssignAssetComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssignAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
