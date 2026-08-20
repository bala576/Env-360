import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCollectionProfile } from './data-collection-profile';

describe('DataCollectionProfile', () => {
  let component: DataCollectionProfile;
  let fixture: ComponentFixture<DataCollectionProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataCollectionProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataCollectionProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
