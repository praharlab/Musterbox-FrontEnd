import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditMyteamvisitComponent } from './edit-myteamvisit.component';

describe('EditMyteamvisitComponent', () => {
  let component: EditMyteamvisitComponent;
  let fixture: ComponentFixture<EditMyteamvisitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditMyteamvisitComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMyteamvisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
