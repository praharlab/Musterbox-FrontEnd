import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VisitmasterComponent } from './visitmaster.component';

describe('VisitmasterComponent', () => {
  let component: VisitmasterComponent;
  let fixture: ComponentFixture<VisitmasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VisitmasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
