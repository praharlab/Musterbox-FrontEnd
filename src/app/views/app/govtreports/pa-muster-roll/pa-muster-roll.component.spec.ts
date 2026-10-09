import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaMusterRollComponent } from './pa-muster-roll.component';

describe('PaMusterRollComponent', () => {
  let component: PaMusterRollComponent;
  let fixture: ComponentFixture<PaMusterRollComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PaMusterRollComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaMusterRollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
