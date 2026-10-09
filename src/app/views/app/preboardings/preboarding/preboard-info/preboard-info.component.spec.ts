import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreboardInfoComponent } from './preboard-info.component';

describe('PreboardInfoComponent', () => {
  let component: PreboardInfoComponent;
  let fixture: ComponentFixture<PreboardInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreboardInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreboardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
