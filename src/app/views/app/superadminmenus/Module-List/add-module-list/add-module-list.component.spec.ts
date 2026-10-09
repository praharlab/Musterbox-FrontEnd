import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddModuleListComponent } from './add-module-list.component';

describe('AddModuleListComponent', () => {
  let component: AddModuleListComponent;
  let fixture: ComponentFixture<AddModuleListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddModuleListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
