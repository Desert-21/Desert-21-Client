import { Observable, combineLatest, Subject } from 'rxjs';
import { RequestableResource } from './requestable-resource';

export abstract class ResourceProcessor<ResourceType>
  implements RequestableResource<ResourceType>
{

  protected dataSources: Array<RequestableResource<any>>;
  protected subject: Subject<ResourceType> = new Subject();

  protected abstract processData(dataElements: Array<any>): ResourceType;

  constructor(dataSources: Array<RequestableResource<any>>) {
    this.dataSources = dataSources;
    const observables = this.dataSources.map(ds => ds.getStateUpdates());
    combineLatest(observables).subscribe(resp => {
      const processed = this.processData(resp);
      this.subject.next(processed);
    });
  }

  requestState(): void {
    this.dataSources.forEach(dataSource => dataSource.requestState());
  }

  getStateUpdates(): Observable<ResourceType> {
    return this.subject.asObservable();
  }
}
