import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Manufacture } from './manufacture';

describe('Manufacture', () => {
  let component: Manufacture;
  let fixture: ComponentFixture<Manufacture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Manufacture]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Manufacture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
