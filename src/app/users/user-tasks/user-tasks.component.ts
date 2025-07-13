import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { UsersService } from '../users.service';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-tasks',
  standalone: true,
  templateUrl: './user-tasks.component.html',
  styleUrl: './user-tasks.component.css',
  imports: [RouterOutlet, RouterLink],
})
export class UserTasksComponent implements OnInit {
  // userId = input.required();

  userName = '';
  message = input.required<string>();
  activatedRoute = inject(ActivatedRoute);
  destoryRef = inject(DestroyRef);
  users = inject(UsersService);
  // userName = computed(
  //   () => this.users.users.find((u) => u.id === this.userId())?.name
  // );

  ngOnInit(): void {
    console.log(this.activatedRoute, this.message());

    const subscribe = this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        this.userName =
          this.users.users.find((u) => u.id === paramMap.get('userId'))?.name ||
          '';
      },
    });
    this.destoryRef.onDestroy(() => subscribe.unsubscribe());
  }
}
