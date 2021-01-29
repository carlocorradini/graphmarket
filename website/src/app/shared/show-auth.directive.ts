import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import { UserService } from '../core';

@Directive({ selector: '[appShowAuth]' })
export class ShowAuthDirective implements OnInit {
  public condition: boolean;

  constructor(
    private templateRef: TemplateRef<any>,
    private userService: UserService,
    private viewContainer: ViewContainerRef
  ) {
    this.condition = false;
  }

  ngOnInit() {
    this.userService.isAuth.subscribe(
      (isAuth) => {
        if (isAuth && this.condition || !isAuth && !this.condition) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      }
    );
  }

  @Input() set appShowAuth(condition: boolean) {
    this.condition = condition;
  }
}