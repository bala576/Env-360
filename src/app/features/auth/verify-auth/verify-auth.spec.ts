import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAuth } from './verify-auth';

describe('VerifyAuth', () => {
  let component: VerifyAuth;
  let fixture: ComponentFixture<VerifyAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyAuth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyAuth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
