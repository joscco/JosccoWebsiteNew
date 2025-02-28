import { Component } from '@angular/core';
import {NotebookIllustrationComponent} from "../../notebook-illustration/notebook-illustration.component";
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-contact-view',
  imports: [
    NotebookIllustrationComponent,
    NgOptimizedImage
  ],
  templateUrl: './contact-view.component.html'
})
export class ContactViewComponent {

}
