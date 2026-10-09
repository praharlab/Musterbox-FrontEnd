import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListResignationProcessComponent } from './list-resignation-process.component';

describe('ListResignationProcessComponent', () => {
  let component: ListResignationProcessComponent;
  let fixture: ComponentFixture<ListResignationProcessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListResignationProcessComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListResignationProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
