import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RepoListingService } from './services/repo-listing.service';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [RepoListingService],
      declarations: [
        AppComponent,
      ],
    }).compileComponents();
  }));

  

});
