import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResignationListComponent } from './resignation-list.component';

describe('ResignationListComponent', () => {
  let component: ResignationListComponent;
  let fixture: ComponentFixture<ResignationListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResignationListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResignationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
