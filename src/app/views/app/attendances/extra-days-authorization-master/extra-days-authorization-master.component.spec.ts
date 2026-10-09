import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExtraDaysAUthorizationMasterComponent } from './extra-days-authorization-master.component';

describe('ExtraDaysAUthorizationMasterComponent', () => {
  let component: ExtraDaysAUthorizationMasterComponent;
  let fixture: ComponentFixture<ExtraDaysAUthorizationMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraDaysAUthorizationMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraDaysAUthorizationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
