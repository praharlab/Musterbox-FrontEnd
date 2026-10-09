import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditModuleListComponent } from './edit-module-list.component';

describe('EditModuleListComponent', () => {
  let component: EditModuleListComponent;
  let fixture: ComponentFixture<EditModuleListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditModuleListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
