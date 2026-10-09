import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagePaneltyComponent } from './manage-panelty.component';

describe('ManagePaneltyComponent', () => {
  let component: ManagePaneltyComponent;
  let fixture: ComponentFixture<ManagePaneltyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ManagePaneltyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePaneltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
