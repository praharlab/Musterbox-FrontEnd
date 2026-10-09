import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OvertimesComponent } from './overtimes.component';

describe('OvertimesComponent', () => {
  let component: OvertimesComponent;
  let fixture: ComponentFixture<OvertimesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OvertimesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
