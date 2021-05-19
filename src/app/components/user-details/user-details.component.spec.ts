import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule }            from '@angular/material/icon';

import { UserDetailsComponent } from './user-details.component';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailsComponent ],
      imports : [MatIconModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

  });


  it('verify user details', () => {

    component.userDetails = {
      name        : "John Papa",
      location    : "Orlando, FL",
      imageUrl    : "https://avatars.githubusercontent.com/u/1202528?v=4",
      htmlUrl     : "https://github.com/johnpapa",
      twitterUrl  : "john_papa",
      bio         : "Winter is Coming",
    }

    component.showSkeleton  = false
    fixture.detectChanges()


    const userName  = document.getElementsByClassName('user-name'),
          twitter   = document.getElementsByClassName('twitter'),
          bio       = document.getElementsByClassName('bio')


    expect((userName[0] as any).innerText).toBe('John Papa')
    expect((twitter[0] as any).innerText).toBe('Twitter : https://twitter.com/john_papa')
    expect((bio[0] as any).innerText).toBe('Winter is Coming')

  });



});
