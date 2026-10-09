import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyfinancesmasterComponent } from './myfinancesmaster.component';

describe('MyfinancesmasterComponent', () => {
  let component: MyfinancesmasterComponent;
  let fixture: ComponentFixture<MyfinancesmasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MyfinancesmasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyfinancesmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
