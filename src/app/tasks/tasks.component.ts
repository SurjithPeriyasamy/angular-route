import { Component, inject, input } from '@angular/core';
import { ResolveFn, RouterLink } from '@angular/router';

import { TaskComponent } from './task/task.component';
import { TasksService } from './tasks.service';
import { Task } from './task/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  imports: [TaskComponent, RouterLink],
})
export class TasksComponent {
  userTasks = input.required<Task[]>();
  userId = input.required<string>();
  order = input<'asc' | 'desc' | undefined>();
}

export const resolveUserTasks: ResolveFn<Task[]> = (
  activatedRouteSnapshot,
  routerState
) => {
  const order = activatedRouteSnapshot.queryParams['order'];
  const tasksService = inject(TasksService);
  const tasks = tasksService
    .allTasks()
    .filter(
      (task) => task.userId === activatedRouteSnapshot.paramMap.get('userId')
    );

  if (order && order === 'asc') {
    tasks.sort((a, b) => (a.id > b.id ? 1 : -1));
  } else {
    tasks.sort((a, b) => (a.id > b.id ? -1 : 1));
  }

  return tasks.length ? tasks : [];
};

// import {
//   Component,
//   computed,
//   DestroyRef,
//   inject,
//   input,
//   OnDestroy,
//   OnInit,
//   signal,
//   Signal,
// } from '@angular/core';

// import { TaskComponent } from './task/task.component';
// import { Task } from './task/task.model';
// import { TasksService } from './tasks.service';
// import { ActivatedRoute, RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-tasks',
//   standalone: true,
//   templateUrl: './tasks.component.html',
//   styleUrl: './tasks.component.css',
//   imports: [TaskComponent, RouterLink],
// })
// export class TasksComponent implements OnInit, OnDestroy {
//   ngOnDestroy(): void {
//     throw new Error('Method not implemented.');
//   }
//   userId = input.required<string>();
//   // order = input<'asc' | 'desc'>();
//   order = signal<'asc' | 'desc'>('asc');
//   private destoryRef = inject(DestroyRef);
//   private tasksService = inject(TasksService);
//   userTasks: () => Task[] = computed(() =>
//     this.tasksService
//       .allTasks()
//       .filter((task) => task.userId === this.userId())
//       .sort((a, b) =>
//         this.order() === 'asc'
//           ? a.title.localeCompare(b.title)
//           : b.title.localeCompare(a.title)
//       )
//   );
//   private activatedRoute = inject(ActivatedRoute);

//   ngOnInit(): void {
//     const sub = this.activatedRoute.queryParams.subscribe({
//       next: (params) => this.order.set(params['order']),
//     });
//     this.destoryRef.onDestroy(() => sub.unsubscribe());
//   }
// }
