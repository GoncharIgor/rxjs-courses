import { Component } from '@angular/core';
import {LoadingService} from './loading.service';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {

  // public - to be visible in component
  constructor(public loadingService: LoadingService) {

  }
}
