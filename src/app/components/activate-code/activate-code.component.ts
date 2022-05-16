import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivateCodeRequest } from './activate-code-types';

@Component({
  selector: 'app-activate-code',
  templateUrl: './activate-code.component.html',
  styleUrls: ['./activate-code.component.scss']
})
export class ActivateCodeComponent implements OnInit {

  isLoading = true;
  isSucceeded = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
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
      console.log(code);
    });
  }

}
