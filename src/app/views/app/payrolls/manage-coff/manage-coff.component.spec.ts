import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageCoffComponent } from './manage-coff.component';

describe('ManageCoffComponent', () => {
  let component: ManageCoffComponent;
  let fixture: ComponentFixture<ManageCoffComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ManageCoffComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
