import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppversionComponent } from './appversion.component';

describe('AppversionComponent', () => {
  let component: AppversionComponent;
  let fixture: ComponentFixture<AppversionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppversionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
