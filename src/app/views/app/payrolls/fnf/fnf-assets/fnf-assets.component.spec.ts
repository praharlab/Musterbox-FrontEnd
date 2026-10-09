import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FnfAssetsComponent } from './fnf-assets.component';

describe('FnfAssetsComponent', () => {
  let component: FnfAssetsComponent;
  let fixture: ComponentFixture<FnfAssetsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FnfAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FnfAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
