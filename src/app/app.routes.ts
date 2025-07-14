import {
  CanMatchFn,
  RedirectCommand,
  ResolveFn,
  Router,
  Routes,
} from '@angular/router';
import { NoTaskComponent } from './tasks/no-task/no-task.component';
import {
  resolveTitle,
  resolveUserName,
  UserTasksComponent,
} from './users/user-tasks/user-tasks.component';
import {
  canLeaveEditPage,
  NewTaskComponent,
} from './tasks/new-task/new-task.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { inject } from '@angular/core';
import { Task } from './tasks/task/task.model';
import { TasksService } from './tasks/tasks.service';

export const dummyCanMatch: CanMatchFn = (routeData) => {
  console.log(routeData, 'routeData');

  const router = inject(Router);

  if (Math.random() < 0.5) {
    return true;
  }
  return new RedirectCommand(router.parseUrl('/unauthorized'));
};
const resolveUserTasks: ResolveFn<Task[]> = (
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

export const routes: Routes = [
  { path: '', component: NoTaskComponent, title: 'No task selected' },
  {
    path: 'users/:userId',
    component: UserTasksComponent,
    // canMatch: [dummyCanMatch],
    data: {
      message: 'hello',
    },
    resolve: {
      userName: resolveUserName,
    },
    title: resolveTitle,
    children: [
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./tasks/tasks.component').then((mod) => mod.TasksComponent),
        runGuardsAndResolvers: 'always',
        resolve: {
          userTasks: resolveUserTasks,
        },
      },
      {
        path: 'tasks/new',
        component: NewTaskComponent,
        canDeactivate: [canLeaveEditPage],
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
