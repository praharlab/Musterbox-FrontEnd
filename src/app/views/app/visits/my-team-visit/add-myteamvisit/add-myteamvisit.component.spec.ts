import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddMyteamvisitComponent } from './add-myteamvisit.component';

describe('AddMyteamvisitComponent', () => {
  let component: AddMyteamvisitComponent;
  let fixture: ComponentFixture<AddMyteamvisitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddMyteamvisitComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMyteamvisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
