import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CoffAcceptRejectModalComponent } from './coff-accept-reject-modal.component';

describe('CoffAcceptRejectModalComponent', () => {
  let component: CoffAcceptRejectModalComponent;
  let fixture: ComponentFixture<CoffAcceptRejectModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CoffAcceptRejectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoffAcceptRejectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
