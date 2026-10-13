import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reportsandcompliance } from './reportsandcompliance';

describe('Reportsandcompliance', () => {
  let component: Reportsandcompliance;
  let fixture: ComponentFixture<Reportsandcompliance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reportsandcompliance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reportsandcompliance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
