import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { EstadoTurnoService } from '../../core/services/estado-turno.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { EstadoTurno } from '../../shared/models';
import { setFormErrorsFromApi } from '../../shared/utils/form-errors.util';

const ESTADO_PATTERN = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/u;

@Component({
  selector: 'app-estados-turno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './estados-turno.component.html',
  styleUrl: './estados-turno.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstadosTurnoComponent implements OnInit {
  private readonly service = inject(EstadoTurnoService);
  private readonly fb = inject(FormBuilder);

  readonly items = signal<EstadoTurno[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly selectedItem = signal<EstadoTurno | null>(null);
  readonly confirmDeleteOpen = signal(false);
  readonly itemToDelete = signal<EstadoTurno | null>(null);
  readonly hasItems = computed(() => this.items().length > 0);

  readonly form = this.fb.nonNullable.group({
    nombre: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(ESTADO_PATTERN)]
    ]
  });

  ngOnInit(): void {
    this.loadItems();
  }

  trackById(_: number, item: EstadoTurno): number {
    return item.id;
  }

  startCreate(): void {
    this.error.set(null);
    this.selectedItem.set(null);
    this.showForm.set(true);
    this.form.reset({ nombre: '' });
  }

  startEdit(item: EstadoTurno): void {
    this.error.set(null);
    this.selectedItem.set(item);
    this.showForm.set(true);
    this.form.reset({ nombre: item.nombre });
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.selectedItem.set(null);
    this.form.reset();
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = { nombre: this.form.controls.nombre.value.trim() };
    const selected = this.selectedItem();
    this.saving.set(true);
    this.error.set(null);

    const request$ = selected
      ? this.service.update(selected.id, payload)
      : this.service.create(payload);

    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          if (selected) {
            this.items.update((items) => items.map((item) => (item.id === response.id ? response : item)));
          } else {
            this.items.update((items) => [...items, response]);
          }
          this.cancelForm();
        },
        error: (error) => {
          this.error.set('No se pudo guardar el estado de turno. Revisa los datos e inténtalo nuevamente.');
          setFormErrorsFromApi(this.form, error);
        }
      });
  }

  promptDelete(item: EstadoTurno): void {
    this.itemToDelete.set(item);
    this.confirmDeleteOpen.set(true);
  }

  closeDeleteDialog(): void {
    this.confirmDeleteOpen.set(false);
    this.itemToDelete.set(null);
  }

  confirmDelete(): void {
    const item = this.itemToDelete();
    if (!item) {
      return;
    }

    this.deleting.set(true);
    this.service
      .delete(item.id)
      .pipe(
        finalize(() => {
          this.deleting.set(false);
          this.closeDeleteDialog();
        })
      )
      .subscribe({
        next: () => {
          this.items.update((items) => items.filter((current) => current.id !== item.id));
        },
        error: () => {
          this.error.set('No se pudo eliminar el estado de turno. Inténtalo nuevamente.');
        }
      });
  }

  private loadItems(): void {
    this.loading.set(true);
    this.service
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (items) => this.items.set(items),
        error: () => this.error.set('No se pudieron cargar los estados de turno.')
      });
  }
}
