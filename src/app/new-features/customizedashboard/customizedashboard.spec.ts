import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Customizedashboard } from './customizedashboard';

describe('Customizedashboard', () => {
  let component: Customizedashboard;
  let fixture: ComponentFixture<Customizedashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Customizedashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Customizedashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
