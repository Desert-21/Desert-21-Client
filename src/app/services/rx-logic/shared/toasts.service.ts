import { Injectable } from '@angular/core';
import { ModifiableResource } from '../templates/modifiable-resource';

export type ToastTheme = 'DANGER' | 'WARNING' | 'PRIMARY' | 'SUCCESS';

export type ToastRequest = {
  theme: ToastTheme;
  title: string;
  description: string;
};

export type ToastEntry = {
  classes: string;
  title: string;
  description: string;
};

@Injectable({
  providedIn: 'root',
})
export class ToastsService extends ModifiableResource<Array<ToastEntry>> {
  constructor() {
    super();
  }

  protected initialize(): ToastEntry[] {
    return [];
  }

  private processRequest(req: ToastRequest): ToastEntry {
    const { title, description, theme } = req;
    const classes = this.themeToClasses(theme);

    return {
      title,
      description,
      classes,
    };
  }

  private themeToClasses(theme: ToastTheme): string {
    switch (theme) {
      case 'DANGER':
        return 'bg-danger text-light';
      case 'WARNING':
        return 'bg-warning text-secondary';
      case 'PRIMARY':
        return 'bg-primary text-light';
      case 'SUCCESS':
        return 'bg-success text-light';
    }
  }

  add(req: ToastRequest): void {
    this.current.push(this.processRequest(req));
    this.set(this.current);
  }

  remove(toast: ToastEntry): void {
    this.current = this.current.filter((c) => c !== toast);
    this.set(this.current);
  }
}
