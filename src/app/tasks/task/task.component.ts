import { Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { type Task } from './task.model';
import { CardComponent } from '../../shared/card/card.component';
import { TasksService } from '../tasks.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task',
  standalone: true,
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
  imports: [DatePipe, CardComponent],
})
export class TaskComponent {
  task = input.required<Task>();
  private tasksService = inject(TasksService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  onComplete() {
    this.tasksService.removeTask(this.task().id);
    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute, //Interpret ['./'] relative to the current route (not absolute).
      onSameUrlNavigation: 'reload', //Tells Angular to re-run guards, resolvers, and reload the component even if you're navigating to the same URL. Normally, Angular ignores navigation to the same route.
      queryParamsHandling: 'preserve', //Keeps existing query parameters (e.g., ?page=2) instead of dropping them.
    });
  }
}
