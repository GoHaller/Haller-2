import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-analitics-dashboard',
  templateUrl: './analitics-dashboard.component.html',
  styleUrls: ['./analitics-dashboard.component.css']
})
export class AnaliticsDashboardComponent implements OnInit {

  public baseUrl: string = 'none';
  constructor() { }

  ngOnInit() {
    this.baseUrl = environment.ApiBaseUrl;
  }

}
