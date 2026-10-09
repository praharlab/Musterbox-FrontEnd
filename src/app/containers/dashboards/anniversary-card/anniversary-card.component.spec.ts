import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnniversaryCardComponent } from './anniversary-card.component';

describe('AnniversaryCardComponent', () => {
  let component: AnniversaryCardComponent;
  let fixture: ComponentFixture<AnniversaryCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AnniversaryCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnniversaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
