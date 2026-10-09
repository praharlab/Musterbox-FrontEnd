import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreboardingsComponent } from './preboardings.component';

describe('PreboardingsComponent', () => {
  let component: PreboardingsComponent;
  let fixture: ComponentFixture<PreboardingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PreboardingsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreboardingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
