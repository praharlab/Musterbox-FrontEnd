import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditNdaCategoryComponent } from './edit-nda-category.component';

describe('EditNdaCategoryComponent', () => {
  let component: EditNdaCategoryComponent;
  let fixture: ComponentFixture<EditNdaCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditNdaCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNdaCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
