import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TasksService } from '../tasks.service';
import {
  CanDeactivate,
  CanDeactivateFn,
  Router,
  RouterLink,
} from '@angular/router';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  userId = input.required<string>();
  enteredTitle = signal('');
  enteredSummary = signal('');
  enteredDate = signal('');
  isSubmitted = false;
  private tasksService = inject(TasksService);
  private router = inject(Router);

  onSubmit() {
    this.tasksService.addTask(
      {
        title: this.enteredTitle(),
        summary: this.enteredSummary(),
        date: this.enteredDate(),
      },
      this.userId()
    );
    this.isSubmitted = true;
    this.router.navigate(['/users', this.userId(), 'tasks']);
  }
}
export const canLeaveEditPage: CanDeactivateFn<NewTaskComponent> = (
  component
) => {
  const { enteredDate, enteredSummary, enteredTitle, isSubmitted } = component;
  if (isSubmitted) {
    return true;
  }
  if (enteredDate() || enteredSummary() || enteredTitle()) {
    return window.confirm(
      'Do you want to leave this page. Your data might not be saved'
    );
  }
  return true;
};
