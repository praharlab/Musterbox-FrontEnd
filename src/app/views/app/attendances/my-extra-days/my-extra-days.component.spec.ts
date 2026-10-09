import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyExtraDaysComponent } from './my-extra-days.component';

describe('MyExtraDaysComponent', () => {
  let component: MyExtraDaysComponent;
  let fixture: ComponentFixture<MyExtraDaysComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyExtraDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyExtraDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
