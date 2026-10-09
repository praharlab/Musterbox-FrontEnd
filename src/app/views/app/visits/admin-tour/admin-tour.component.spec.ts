import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminTourComponent } from './admin-tour.component';

describe('AdminTourComponent', () => {
  let component: AdminTourComponent;
  let fixture: ComponentFixture<AdminTourComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTourComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
