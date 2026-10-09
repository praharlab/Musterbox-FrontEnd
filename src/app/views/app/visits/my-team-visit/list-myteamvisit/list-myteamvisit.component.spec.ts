import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListMyteamvisitComponent } from './list-myteamvisit.component';

describe('ListMyteamvisitComponent', () => {
  let component: ListMyteamvisitComponent;
  let fixture: ComponentFixture<ListMyteamvisitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListMyteamvisitComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMyteamvisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
