import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReapplyComponent } from './reapply.component';

describe('ReapplyComponent', () => {
  let component: ReapplyComponent;
  let fixture: ComponentFixture<ReapplyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ReapplyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReapplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
