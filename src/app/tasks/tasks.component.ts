import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  Signal,
} from '@angular/core';

import { TaskComponent } from './task/task.component';
import { Task } from './task/task.model';
import { TasksService } from './tasks.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  imports: [TaskComponent, RouterLink],
})
export class TasksComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  userId = input.required<string>();
  // order = input<'asc' | 'desc'>();
  order = signal<'asc' | 'desc'>('asc');
  private destoryRef = inject(DestroyRef);
  private tasksService = inject(TasksService);
  userTasks: () => Task[] = computed(() =>
    this.tasksService
      .allTasks()
      .filter((task) => task.userId === this.userId())
      .sort((a, b) =>
        this.order() === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      )
  );
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const sub = this.activatedRoute.queryParams.subscribe({
      next: (params) => this.order.set(params['order']),
    });
    this.destoryRef.onDestroy(() => sub.unsubscribe());
  }
}
