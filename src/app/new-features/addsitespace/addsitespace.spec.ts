import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addsitespace } from './addsitespace';

describe('Addsitespace', () => {
  let component: Addsitespace;
  let fixture: ComponentFixture<Addsitespace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addsitespace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addsitespace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
