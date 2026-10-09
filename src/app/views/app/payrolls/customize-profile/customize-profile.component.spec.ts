import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomizeProfileComponent } from './customize-profile.component';

describe('CustomizeProfileComponent', () => {
  let component: CustomizeProfileComponent;
  let fixture: ComponentFixture<CustomizeProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizeProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
