import { TestBed } from '@angular/core/testing';

import { DeslogadoGuard } from './deslogado.guard';

describe('DeslogadoGuard', () => {
  let guard: DeslogadoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DeslogadoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
