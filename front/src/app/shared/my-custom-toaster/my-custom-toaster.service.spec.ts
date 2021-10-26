import { TestBed } from '@angular/core/testing';

import { MyCustomToasterService } from './my-custom-toaster.service';

describe('MyCustomToasterService', () => {
  let service: MyCustomToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyCustomToasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
