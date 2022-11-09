import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/services/error.service';
import { ToastsService } from 'src/app/services/rx-logic/shared/toasts.service';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss'],
})
export class AddFriendComponent implements OnInit {
  isLoading = false;
  playersId = '';

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private toastsService: ToastsService
  ) {}

  ngOnInit(): void {}

  isButtonDisabled(): boolean {
    return this.playersId.length < 1 || this.isLoading;
  }

  onInviteClick(): void {
    this.isLoading = true;

    this.http.post(`/friends/request/${this.playersId}`, null).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastsService.add({
          theme: 'PRIMARY',
          title: 'Invite has been send!',
          description: 'You must now wait until player accepts your request.'
        });
        this.playersId = '';
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorService.showError(err.error);
      },
    });
  }
}
