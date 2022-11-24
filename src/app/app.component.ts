import { Component } from "@angular/core";
import { RepoListingService } from "./services/repo-listing.service";
import { UserDetailsParams } from "./components/user-details/user-details.component";
import { RepoListParams } from "./components/repo-list/repo-list.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  userInfo: UserDetailsParams;

  repoLists: RepoListParams[];

  totalRepos: number;

  currentPage: number;

  showSkeleton: boolean = false;

  direction: string = "desc";

  errorText: string = "" ;

  private userName: string = ""

  constructor(private repoListingService: RepoListingService) {}

  /*=====================================================================
                              PRIVATE
  =====================================================================*/
  private resetPreviousData() {
    if (this.userInfo) {
      this.userInfo = null;
      this.repoLists = null;
      this.totalRepos = 0
      this.currentPage = 0
    }
  }

  /*=====================================================================
                              HTML
  =====================================================================*/

  async getUserInfo(userName: string) {
    if (this.showSkeleton) return;

    this.showSkeleton = true;

    this.currentPage = 1;

    const resp = await this.repoListingService.getUserInfo(userName);

    if (resp["error"]) {
      if (resp["status"] === 404) {
        this.errorText = "User not found";
      } else {
        this.errorText = resp["statusText"];
      }
      this.showSkeleton = false;
      this.resetPreviousData();
      return;
    }

    this.userName = userName;
    this.totalRepos = resp["public_repos"] > 100 ? 100 : resp["public_repos"];

    this.userInfo = {
      name: resp["name"],
      imageUrl: resp["avatar_url"],
      htmlUrl: resp["html_url"],
      location: resp["location"],
      bio: resp["bio"],
      twitterUrl: resp["twitter_username"],
    };
  }

  async submit(inputCont: HTMLInputElement) {
    if (!inputCont.value) {
      this.errorText = "Please enter valid user name";
      return;
    }

    const userName = inputCont.value;
    this.errorText = "";

    if (this.userName === userName) return;

    await this.getUserInfo(userName);

    if (!this.userInfo) return;

    const repos = await this.repoListingService.getReposforUserName(
      userName,
      this.currentPage
    );

    if (repos["error"]) {
      this.errorText = repos["statusText"];
      this.showSkeleton = false;
      return;
    }

    this.repoLists = repos as RepoListParams[];
    this.showSkeleton = false;
  }

  async onPageNumberChange(
    pageNumber: number,
    direction: string = this.direction
  ) {
    if (this.errorText) this.errorText = "";

    if (isNaN(pageNumber)) return;
    this.currentPage = pageNumber;
    this.direction = direction;

    this.showSkeleton = true;
    this.repoLists = [];

    const resp = await this.repoListingService.getReposforUserName(
      this.userName,
      this.currentPage,
      direction
    );

    if (resp["error"]) {
      this.errorText = resp["statusText"];
      this.showSkeleton = false;
      return;
    }

    this.showSkeleton = false;
    this.repoLists = resp as RepoListParams[];
  }
}
