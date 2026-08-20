import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectivityProfile } from './connectivity-profile';

describe('ConnectivityProfile', () => {
  let component: ConnectivityProfile;
  let fixture: ComponentFixture<ConnectivityProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectivityProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectivityProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
