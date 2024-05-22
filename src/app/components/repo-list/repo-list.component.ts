import { Component, Input, SimpleChanges } from '@angular/core';

export interface RepoListParams {
  name        : string
  description : string
  full_name   : string
  topics      : string[]
}

@Component({
  selector    : 'app-repo-list',
  templateUrl : './repo-list.component.html',
  styleUrls   : ['./repo-list.component.scss']
})

export class RepoListComponent {

  @Input() repoList  : RepoListParams[]  = []
  @Input() showSkeleton : boolean = true

  constructor() { 
    window['repo']  = this
  }

  ngOnInit() {

    if (!this.repoList || !this.repoList.length) {

      this.repoList = []
      for (let i = 0 ; i < 10; i++) {
        this.repoList.push(i as any)
        console.log('coming here-----')
      }
    }

  }

  ngOnChanges(simpleChanges : SimpleChanges) {

    const showSkeleton  = simpleChanges['showSkeleton']

    if (showSkeleton) {
      
      if (!showSkeleton.previousValue && showSkeleton.currentValue) {
        this.repoList = []
        for (let i = 0 ; i < 10; i++) {
          this.repoList.push(i as any)
        }
      }
      
    }



  }

}
