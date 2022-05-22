import { Observable, Subject } from 'rxjs';
import { RequestableResource } from '../rx-logic/requestable-resource';

// generic service for http GET's, retrieving the data and sending further via pipelines
export abstract class GenericHttpService <ResponseType> implements RequestableResource <ResponseType> {

  private isFetched = false;
  private currentState: ResponseType = null;
  private stateSub = new Subject<ResponseType>();

  // method to implement calling http in order to retrieve the data
  protected abstract callHttp(...args: any[]): Observable<ResponseType>;

  // getting access to observable and state updates
  getStateUpdates(): Observable<ResponseType> {
    return this.stateSub.asObservable();
  }

  // requesting a state update
  requestState(): void {
    if (this.currentState !== null) {
      this.stateSub.next(this.currentState);
      return;
    }
    if (this.isFetched) {
      return;
    }
    this.fetchState();
  }

  // forcing a state fetch by calling http
  fetchState(): void {
    this.isFetched = true;
    this.callHttp().subscribe(resp => {
      this.currentState = resp;
      this.stateSub.next(resp);
      this.isFetched = false;
    });
  }

  // getting current state without any observables, etc.
  getCurrentState(): ResponseType | null {
    return this.currentState;
  }

  // forcing an update of current state
  updateState(response: ResponseType): void {
    this.currentState = response;
    this.stateSub.next(response);
  }
}
