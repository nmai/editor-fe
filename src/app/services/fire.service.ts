import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { filter, last, takeLast, takeUntil } from 'rxjs/operators'

type AuthState = 'signedin' | 'signedout' | 'pending';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyDWi2ZlKWe2vIbVLaIB4n-Ik_WE4j780rw",
      authDomain: "editor-fe.firebaseapp.com",
      databaseURL: "https://editor-fe.firebaseio.com",
      projectId: "editor-fe",
      storageBucket: "editor-fe.appspot.com",
      messagingSenderId: "938156437949",
      appId: "1:938156437949:web:a660af9fe9d2296effe2d4"
    });
  }

}
