import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditModuleDetailsComponent } from './edit-module-details.component';

describe('EditModuleDetailsComponent', () => {
  let component: EditModuleDetailsComponent;
  let fixture: ComponentFixture<EditModuleDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditModuleDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModuleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
