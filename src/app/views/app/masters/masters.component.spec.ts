import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MastersComponent } from './masters.component';

describe('MastersComponent', () => {
  let component: MastersComponent;
  let fixture: ComponentFixture<MastersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MastersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
