import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyassetComponent } from './myasset.component';

describe('MyassetComponent', () => {
  let component: MyassetComponent;
  let fixture: ComponentFixture<MyassetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MyassetComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
