import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Monitoring } from './monitoring';

describe('Monitoring', () => {
  let component: Monitoring;
  let fixture: ComponentFixture<Monitoring>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Monitoring],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Monitoring);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
