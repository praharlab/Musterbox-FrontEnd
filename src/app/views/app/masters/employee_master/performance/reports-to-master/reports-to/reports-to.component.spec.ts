import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportsToComponent } from './reports-to.component';

describe('ReportsToComponent', () => {
  let component: ReportsToComponent;
  let fixture: ComponentFixture<ReportsToComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsToComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
