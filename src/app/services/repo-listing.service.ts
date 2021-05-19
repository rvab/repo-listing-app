import { Injectable }         from '@angular/core'
import { HttpClient, 
         HttpErrorResponse 
       }                      from '@angular/common/http';
import { RepoListParams }     from '../components/repo-list/repo-list.component'

const MAX_REPOS_PER_PAGE  = 10

const URLS  = {
  SUFFIX    : `/repos?per_page=${MAX_REPOS_PER_PAGE}&page=`,
  SORT      : '&sort=created',
  DIRECTION : '&direction=',
  USER_INFO : 'https://api.github.com/users/'
}
 

const HEADERS = {
  'Accept' : 'application/vnd.github.mercy-preview+json' //to get topics
}

type CachedDataType = {data  : {[key : number] : RepoListParams[]}}

export interface CachedData {
  [key : string ] : CachedDataType
}



@Injectable({
  providedIn: 'root'
})

export class RepoListingService {

  private dataMap : CachedData  = {}

  constructor(private httpClient  : HttpClient) { 
    window['service'] = this
  }

  /*=====================================================================
                              PRIVATE
  =====================================================================*/

  async getUserInfo(userName  : string) {

    try {
      this.dataMap  = {}
      const resp  = await this.httpClient.get(`${URLS.USER_INFO}${userName}`).toPromise()
      return resp
    } catch(err) {
      return err
    }
  
  }

  async getReposforUserName(userName  : string, 
                           pageNumber : number = 1, 
                           direction  : string  = 'desc') : Promise<object[] | HttpErrorResponse> {

    if (!this.dataMap[direction] || !this.dataMap[direction]['data'] || !this.dataMap[direction]['data'][pageNumber]) {

      try {
        const url = `${URLS.USER_INFO}${userName}${URLS.SUFFIX}${pageNumber}${URLS.SORT}${URLS.DIRECTION}${direction}`
        const resp  = await this.httpClient.get(url, {
          headers : HEADERS
        }).toPromise()

        if (!this.dataMap[direction]) this.dataMap[direction] = {} as CachedDataType
        if (!this.dataMap[direction]['data']) this.dataMap[direction]['data'] = {}

        this.dataMap[direction]['data'][pageNumber] = resp as RepoListParams[]

  
        return resp as object[]
  
  
      } catch(err) {
        return err
      }
    } 
    else {
      return this.dataMap[direction]['data'][pageNumber]
    }

  }


}
