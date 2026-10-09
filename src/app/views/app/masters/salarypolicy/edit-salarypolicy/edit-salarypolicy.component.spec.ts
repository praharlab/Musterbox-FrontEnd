import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditSalarypolicyComponent } from './edit-salarypolicy.component';

describe('EditSalarypolicyComponent', () => {
  let component: EditSalarypolicyComponent;
  let fixture: ComponentFixture<EditSalarypolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditSalarypolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSalarypolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
