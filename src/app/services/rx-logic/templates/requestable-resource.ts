import { Observable } from 'rxjs';

export interface RequestableResource<ResponseType> {
  requestState(): void;
  getStateUpdates(): Observable<ResponseType>;
}
