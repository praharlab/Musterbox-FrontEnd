import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AsignassettoempComponent } from './asignassettoemp.component';

describe('AsignassettoempComponent', () => {
  let component: AsignassettoempComponent;
  let fixture: ComponentFixture<AsignassettoempComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsignassettoempComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignassettoempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
