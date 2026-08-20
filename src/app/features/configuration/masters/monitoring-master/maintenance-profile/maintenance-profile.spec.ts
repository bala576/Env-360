import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceProfile } from './maintenance-profile';

describe('MaintenanceProfile', () => {
  let component: MaintenanceProfile;
  let fixture: ComponentFixture<MaintenanceProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
