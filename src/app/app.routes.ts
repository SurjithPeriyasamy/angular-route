import { CanMatchFn, RedirectCommand, Router, Routes } from '@angular/router';
import { NoTaskComponent } from './tasks/no-task/no-task.component';
import {
  resolveTitle,
  resolveUserName,
  UserTasksComponent,
} from './users/user-tasks/user-tasks.component';
import { resolveUserTasks, TasksComponent } from './tasks/tasks.component';
import { NewTaskComponent } from './tasks/new-task/new-task.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { inject } from '@angular/core';

export const dummyCanMatch: CanMatchFn = (routeData) => {
  console.log(routeData, 'routeData');

  const router = inject(Router);

  if (Math.random() < 0.5) {
    return true;
  }
  return new RedirectCommand(router.parseUrl('/unauthorized'));
};
export const routes: Routes = [
  { path: '', component: NoTaskComponent, title: 'No task selected' },
  {
    path: 'users/:userId',
    component: UserTasksComponent,
    canMatch: [dummyCanMatch],
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
        component: TasksComponent,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        resolve: {
          userTasks: resolveUserTasks,
        },
      },
      {
        path: 'tasks/new',
        component: NewTaskComponent,
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
