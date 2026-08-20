import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataQualityProfile } from './data-quality-profile';

describe('DataQualityProfile', () => {
  let component: DataQualityProfile;
  let fixture: ComponentFixture<DataQualityProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataQualityProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataQualityProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
