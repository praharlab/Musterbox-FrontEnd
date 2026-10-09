import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddSalarypolicyComponent } from './add-salarypolicy.component';

describe('AddSalarypolicyComponent', () => {
  let component: AddSalarypolicyComponent;
  let fixture: ComponentFixture<AddSalarypolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddSalarypolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalarypolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
