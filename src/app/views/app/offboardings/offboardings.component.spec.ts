import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OffboardingsComponent } from './offboardings.component';

describe('OffboardingsComponent', () => {
  let component: OffboardingsComponent;
  let fixture: ComponentFixture<OffboardingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OffboardingsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffboardingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
