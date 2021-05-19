import { BrowserModule }            from '@angular/platform-browser';
import { NgModule }                 from '@angular/core';

import { AppComponent }             from './app.component';
import { NgbModule }                from '@ng-bootstrap/ng-bootstrap';
import { RepoListComponent }        from './components/repo-list/repo-list.component'
import { UserDetailsComponent }     from './components/user-details/user-details.component'
import { HttpClientModule }         from '@angular/common/http';
import { NoopAnimationsModule }     from '@angular/platform-browser/animations';
import { MatIconModule }            from '@angular/material/icon';





@NgModule({
  declarations: [
    AppComponent,
    RepoListComponent,
    UserDetailsComponent
  ],
  
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatIconModule,
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
