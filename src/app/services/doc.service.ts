import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { AuthState, Doc } from '../types';
import { AuthService } from './auth.service';
import { FireService } from './fire.service';

@Injectable({
  providedIn: 'root'
})
export class DocService {
  
  private docCollection: firebase.firestore.CollectionReference;
  
  constructor(
    private authService: AuthService,
  ) {
    this.docCollection = firebase.firestore().collection('docs');
  }

  async fetchMyDoc(): Promise<Doc|null> {
    let docData = await this.docCollection.doc(this.authService.user.uid);
    let doc = await docData.get();
    if (! doc.exists) {
      return null;
    } else {
      return doc.data() as Doc;
    }
  }

  async setMyDoc(body: string) {
    return this.docCollection.doc(firebase.auth().currentUser.uid).set({
      user: firebase.auth().currentUser.uid,
      body: body,
    });
  }

}
