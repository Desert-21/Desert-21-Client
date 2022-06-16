import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActivateCodeRequest } from './activate-code-types';

@Component({
  selector: 'app-activate-code',
  templateUrl: './activate-code.component.html',
  styleUrls: ['./activate-code.component.scss']
})
export class ActivateCodeComponent implements OnInit, OnDestroy {

  isLoading = true;
  isSucceeded = false;

  private sub1: Subscription;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.sub1 = this.route.params.subscribe(params => {
      const code = params.activationCode;
      const email = params.email;
      const request: ActivateCodeRequest = {
        email,
        activationCode: code
      };
      this.http.post('/registration/activation', request).subscribe(resp => {
        this.isLoading = false;
        this.isSucceeded = true;
      },
      err => {
        alert(err.error);
        this.isLoading = false;
        this.isSucceeded = false;
      });
    });
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

}
