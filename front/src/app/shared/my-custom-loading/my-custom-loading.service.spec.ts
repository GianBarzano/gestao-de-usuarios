import { TestBed } from '@angular/core/testing';

import { MyCustomLoadingService } from './my-custom-loading.service';

describe('MyCustomLoadingService', () => {
  let service: MyCustomLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyCustomLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
