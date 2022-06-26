import { Observable, Subject } from 'rxjs';
import { RequestableResource } from './requestable-resource';

export abstract class ModifiableResource<ResourceType>
  implements RequestableResource<ResourceType>
{
  protected current: ResourceType = this.initialize();
  protected sub: Subject<ResourceType> = new Subject();

  protected abstract initialize(): ResourceType;

  requestState(): void {
    this.sub.next(this.current);
  }

  getStateUpdates(): Observable<ResourceType> {
    return this.sub.asObservable();
  }

  set(resource: ResourceType): void {
    this.current = resource;
    this.sub.next(this.current);
  }
}
