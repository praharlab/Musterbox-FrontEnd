import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListUniformDetailComponent } from './list-uniform-detail.component';

describe('ListUniformDetailComponent', () => {
  let component: ListUniformDetailComponent;
  let fixture: ComponentFixture<ListUniformDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUniformDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUniformDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
