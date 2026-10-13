import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Autenticator } from './autenticator';

describe('Autenticator', () => {
  let component: Autenticator;
  let fixture: ComponentFixture<Autenticator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Autenticator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Autenticator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
