import { Injectable } from '@angular/core';
import { ModifiableResource } from '../templates/modifiable-resource';
import { ProcessedFriendEntry } from './processed-friends.service';

export type InvitationInfo = {
  opponentsNickname: string;
  invitationId: string;
};

@Injectable({
  providedIn: 'root',
})
export class PlayerInvitedService extends ModifiableResource<InvitationInfo> {
  constructor() {
    super();
  }

  protected initialize(): InvitationInfo {
    return { opponentsNickname: '', invitationId: '' };
  }
}
