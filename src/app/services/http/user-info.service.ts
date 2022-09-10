import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersData } from '../../models/profile-models.';
import { GenericHttpService } from './generic-http-service';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService extends GenericHttpService<UsersData> {
  constructor(private http: HttpClient) {
    super();
  }

  protected callHttp(): Observable<UsersData> {
    return this.http.get<UsersData>('/users');
  }
}
