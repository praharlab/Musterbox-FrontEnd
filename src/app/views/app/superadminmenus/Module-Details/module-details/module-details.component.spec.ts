import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModuleDetailsComponent } from './module-details.component';

describe('ModuleDetailsComponent', () => {
  let component: ModuleDetailsComponent;
  let fixture: ComponentFixture<ModuleDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModuleDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
