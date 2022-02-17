import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UsersData } from '../models/profile-models.';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor(private http: HttpClient) { }

  private usersData: UsersData = null;
  private usersDataSub = new Subject<UsersData>();

  getUsersDataUpdates(): Observable<UsersData> {
    return this.usersDataSub.asObservable();
  }

  requestUsersData(): void {
    if (this.usersData !== null) {
      this.usersDataSub.next(this.usersData);
      return;
    }
    this.fetchUsersData();
  }

  private fetchUsersData(): void {
    this.http.get<UsersData>('/users').subscribe(data => {
      this.usersData = data;
      this.usersDataSub.next(data);
    })
  }
}
