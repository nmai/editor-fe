import { Component, OnInit } from '@angular/core';
import MediumEditor from 'medium-editor';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { DocService } from '../services/doc.service';
import { LatexExtension } from '../lib/latex.extension';

@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.scss']
})
export class DocComponent implements OnInit {

  private editor: MediumEditor;

  private snapshot: string;
  private saveSubject = new BehaviorSubject<'edit'>(null);

  constructor(
    private docService: DocService,
  ) { }

  async ngOnInit() {
    this.editor = new MediumEditor('.editable', {
      extensions: {
        'latex': new LatexExtension(),
      }
    });

    let doc = await this.docService.fetchMyDoc()
    
    if (doc == null) {
      await this.docService.setMyDoc('Edit Me');
      doc = await this.docService.fetchMyDoc();
    }

    this.editor.setContent(doc.body);
    
    this.editor.subscribe('editableInput', (data, editable) => {
      this.snapshot = this.editor.getContent();
      this.saveSubject.next('edit');
    })
    this.editor.subscribe('autoinsert', (data, editable) => {
      this.snapshot = this.editor.getContent();
      this.saveSubject.next('edit');
    })

    this.saveSubject.pipe(
      filter( event => event != null ),
      debounceTime(1000),
    ).subscribe( this.saveSnapshot.bind(this) );
  }

  async saveSnapshot() {
    if (this.snapshot != null)
      this.docService.setMyDoc(this.snapshot);
  }

}
