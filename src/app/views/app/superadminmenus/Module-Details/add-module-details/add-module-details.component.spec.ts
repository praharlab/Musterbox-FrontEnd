import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddModuleDetailsComponent } from './add-module-details.component';

describe('AddModuleDetailsComponent', () => {
  let component: AddModuleDetailsComponent;
  let fixture: ComponentFixture<AddModuleDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddModuleDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModuleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
