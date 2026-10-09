import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListKraComponent } from './list-kra.component';

describe('ListKraComponent', () => {
  let component: ListKraComponent;
  let fixture: ComponentFixture<ListKraComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListKraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListKraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
