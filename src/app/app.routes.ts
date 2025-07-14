import { CanMatchFn, RedirectCommand, Router, Routes } from '@angular/router';
import { NoTaskComponent } from './tasks/no-task/no-task.component';
import {
  resolveTitle,
  resolveUserName,
  UserTasksComponent,
} from './users/user-tasks/user-tasks.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { inject } from '@angular/core';

import { routes as usersRoutes } from './users/users.routes';

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
    // canMatch: [dummyCanMatch],
    data: {
      message: 'hello',
    },
    resolve: {
      userName: resolveUserName,
    },
    title: resolveTitle,
    loadChildren: () =>
      import('./users/users.routes').then((mod) => mod.routes),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
