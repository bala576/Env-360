import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationProfile } from './notification-profile';

describe('NotificationProfile', () => {
  let component: NotificationProfile;
  let fixture: ComponentFixture<NotificationProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
