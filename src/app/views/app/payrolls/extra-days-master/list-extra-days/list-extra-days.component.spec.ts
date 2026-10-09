import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListExtraDaysComponent } from './list-extra-days.component';

describe('ListExtraDaysComponent', () => {
  let component: ListExtraDaysComponent;
  let fixture: ComponentFixture<ListExtraDaysComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListExtraDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExtraDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
