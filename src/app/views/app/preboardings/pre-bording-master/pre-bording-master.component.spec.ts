import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreBordingMasterComponent } from './pre-bording-master.component';

describe('PreBordingMasterComponent', () => {
  let component: PreBordingMasterComponent;
  let fixture: ComponentFixture<PreBordingMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PreBordingMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreBordingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
