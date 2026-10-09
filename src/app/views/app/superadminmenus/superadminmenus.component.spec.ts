import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuperadminmenusComponent } from './superadminmenus.component';

describe('SuperadminmenusComponent', () => {
  let component: SuperadminmenusComponent;
  let fixture: ComponentFixture<SuperadminmenusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SuperadminmenusComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperadminmenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
