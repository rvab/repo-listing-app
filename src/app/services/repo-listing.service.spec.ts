import { TestBed } from '@angular/core/testing';

import { RepoListingService } from './repo-listing.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('RepoListingService', () => {
  let service: RepoListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [HttpClientTestingModule]
    });
    service = TestBed.inject(RepoListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
