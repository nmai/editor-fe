import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { AuthState } from '../types';
import { FireService } from './fire.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  public authDecisionStream: Observable<AuthState>;
  public user: firebase.User | undefined;

  private authSubject: BehaviorSubject<AuthState>;
  private authProvider: firebase.auth.GoogleAuthProvider;
  
  constructor(
    private fireService: FireService,
  ) {
    this.authSubject = new BehaviorSubject<AuthState>(AuthState.Pending);
    this.authDecisionStream = this.authSubject.pipe(
      filter( state => state == AuthState.Authenticated || state == AuthState.Unauthenticated ),
    );
    this.initialize();
    this.authProvider = new firebase.auth.GoogleAuthProvider();
  }

  /** basically converts the auth stream to a promise- just returns the last value, or waits for it if none. */
  public async waitAuthDecision(): Promise<AuthState> {
    return new Promise<AuthState>( resolve => {
      let sub = this.authDecisionStream.subscribe( state => {
        sub.unsubscribe();
        resolve(state);
      });
    });
  }

  private async initialize() {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase.auth().onAuthStateChanged( async user => {
      if (user) {
        this.user = user;
        this.authSubject.next(AuthState.Authenticated);
      } else {
        this.authSubject.next(AuthState.Unauthenticated);
        await this.login();
      }
    });
  }

  private async login(): Promise<void> {
    // begin login flow
    await firebase.auth().signInWithRedirect(this.authProvider);
  }
}
