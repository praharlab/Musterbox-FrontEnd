import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MySentimentsComponent } from './my-sentiments.component';

describe('MySentimentsComponent', () => {
  let component: MySentimentsComponent;
  let fixture: ComponentFixture<MySentimentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MySentimentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySentimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
