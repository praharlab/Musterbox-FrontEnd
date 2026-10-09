import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyteammasterComponent } from './myteammaster.component';

describe('MyteammasterComponent', () => {
  let component: MyteammasterComponent;
  let fixture: ComponentFixture<MyteammasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MyteammasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyteammasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
