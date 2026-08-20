import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdProfile } from './threshold-profile';

describe('ThresholdProfile', () => {
  let component: ThresholdProfile;
  let fixture: ComponentFixture<ThresholdProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThresholdProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThresholdProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
