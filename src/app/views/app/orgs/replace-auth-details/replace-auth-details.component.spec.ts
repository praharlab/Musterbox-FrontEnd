import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReplaceAuthDetailsComponent } from './replace-auth-details.component';

describe('ReplaceAuthDetailsComponent', () => {
  let component: ReplaceAuthDetailsComponent;
  let fixture: ComponentFixture<ReplaceAuthDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ReplaceAuthDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceAuthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
