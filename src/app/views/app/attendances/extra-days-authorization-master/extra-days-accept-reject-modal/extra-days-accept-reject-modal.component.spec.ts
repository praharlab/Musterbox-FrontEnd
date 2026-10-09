import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExtraDaysAcceptRejectModalComponent } from './extra-days-accept-reject-modal.component';

describe('ExtraDaysAcceptRejectModalComponent', () => {
  let component: ExtraDaysAcceptRejectModalComponent;
  let fixture: ComponentFixture<ExtraDaysAcceptRejectModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraDaysAcceptRejectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraDaysAcceptRejectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
