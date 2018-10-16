import { TestBed } from '@angular/core/testing';

import { MoreInfoService } from './more-info.service';

describe('MoreInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoreInfoService = TestBed.get(MoreInfoService);
    expect(service).toBeTruthy();
  });
});
