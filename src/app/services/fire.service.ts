import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { filter, last, takeLast, takeUntil } from 'rxjs/operators'

type AuthState = 'signedin' | 'signedout' | 'pending';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  public get isAuthenticated(): boolean { return this.authState == 'signedin' };

  private token: string | undefined;
  private authProvider: firebase.auth.GoogleAuthProvider;

  private authState: AuthState = 'pending';

  public authSubject = new BehaviorSubject<AuthState>('pending');

  constructor() { }

  async initialize() {
    firebase.initializeApp({
      apiKey: "AIzaSyDWi2ZlKWe2vIbVLaIB4n-Ik_WE4j780rw",
      authDomain: "editor-fe.firebaseapp.com",
      databaseURL: "https://editor-fe.firebaseio.com",
      projectId: "editor-fe",
      storageBucket: "editor-fe.appspot.com",
      messagingSenderId: "938156437949",
      appId: "1:938156437949:web:a660af9fe9d2296effe2d4"
    });
    this.authProvider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    // this.authSubject.next('pending');
    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        this.authState = 'signedin';
        this.authSubject.next('signedin');
      } else {
        this.authState = 'signedout';
        this.authSubject.next('signedout');
      }
    });

  }

  async login(): Promise<{ success: boolean }> {

    return new Promise( resolve => {
      let authStream = this.authSubject.pipe(
        filter( state => state == 'signedin' || state == 'signedout' ),
      ).subscribe( async state => {
        authStream.unsubscribe();

        if (state == 'signedout') {
          this.authState = 'pending'
          let result = await firebase.auth().getRedirectResult();
          if (result.credential) {
            // @ts-ignore (incomplete typings)
            this.token = result.credential.accessToken;

            this.authState = 'signedin';

            // localStorage.setItem('BearerToken', this.token);
          } else {
            // if no auth, try again
            this.authState = 'signedout';
            await firebase.auth().signInWithRedirect(this.authProvider);
          }
          resolve({ success: false });
        } else {
          // don't really need to do anything
          this.authState = 'signedin';
          resolve({ success: true });
        }
        
      });
    });
  }
}
