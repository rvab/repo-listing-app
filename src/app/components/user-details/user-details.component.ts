import { Component, Input } from '@angular/core'

export interface UserDetailsParams {
  name         : string
  imageUrl     : string
  htmlUrl      : string    
  location    ?: string
  bio         ?: string
  twitterUrl  ?: string
}

@Component({
  selector    : 'app-user-details',
  templateUrl : './user-details.component.html',
  styleUrls   : ['./user-details.component.scss']
})

export class UserDetailsComponent {

  @Input() userDetails  : UserDetailsParams
  @Input() showSkeleton : boolean = true

  constructor() { 

  }

}
