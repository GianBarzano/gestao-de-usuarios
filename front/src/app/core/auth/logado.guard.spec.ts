import { TestBed } from '@angular/core/testing';

import { LogadoGuard } from './logado.guard';

describe('LogadoGuard', () => {
  let guard: LogadoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LogadoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
