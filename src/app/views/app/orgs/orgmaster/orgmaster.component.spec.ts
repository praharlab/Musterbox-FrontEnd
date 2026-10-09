import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrgmasterComponent } from './orgmaster.component';

describe('OrgmasterComponent', () => {
  let component: OrgmasterComponent;
  let fixture: ComponentFixture<OrgmasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrgmasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
