import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoListComponent } from './repo-list.component';

describe('RepoListComponent', () => {
  let component: RepoListComponent;
  let fixture: ComponentFixture<RepoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoListComponent);
    component = fixture.componentInstance;

    component.showSkeleton  = false
    fixture.detectChanges();


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 5 items', () => {
    const items = document.getElementsByClassName('single-repo')

    component.repoList  = [
      {
        name        : "notebook",
        description : "Jupyter Interactive Notebook",
        full_name   : "johnpapa/notebook",
        topics      : []
      },
      {
        name        : "angular-what-if",
        description : null,
        full_name   : "johnpapa/angular-what-if",
        topics      : []
      },
      {
        name        : "http-interceptors",
        description : `The Web apps in this monorepo make HTTP requests and require uniform consistency in how they are executed and handled. This monorepo demonstrates the same app written with Angular and with Svelte. Each app uses HTTP interceptors. 
                       The Angular app uses HttpClient and its interceptors while the Svelte app uses Axios and its interceptors.`,
        full_name   : "johnpapa/http-interceptors",
        topics      : ["javascript", "typescript","angular"]
      },
      {
        name        : "docs-scaffolding",
        description : "Visual Studio Code extension used to create content for Microsoft Learn",
        full_name   : "johnpapa/docs-scaffolding",
        topics      : []
      },
      {
        name        : "kit",
        description : "A monorepo for SvelteKit and friends",
        full_name   : "johnpapa/kit",
        topics      : []
      },
    ]
    component.showSkeleton  = false
    fixture.detectChanges()

    expect(items.length).toBe(5)

  })

  it('if screen is loading, it should show 10 divs of single-repo', () => {
    component.showSkeleton  = true
    fixture.detectChanges();
    const items = document.getElementsByClassName('single-repo')
    expect(items.length).toBe(10)
  })


});
