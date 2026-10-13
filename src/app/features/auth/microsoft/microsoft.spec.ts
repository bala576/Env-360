import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Microsoft } from './microsoft';

describe('Microsoft', () => {
  let component: Microsoft;
  let fixture: ComponentFixture<Microsoft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Microsoft]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Microsoft);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
