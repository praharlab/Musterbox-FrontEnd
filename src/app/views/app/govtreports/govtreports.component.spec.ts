import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GovtreportsComponent } from './govtreports.component';

describe('GovtreportsComponent', () => {
  let component: GovtreportsComponent;
  let fixture: ComponentFixture<GovtreportsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GovtreportsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovtreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
