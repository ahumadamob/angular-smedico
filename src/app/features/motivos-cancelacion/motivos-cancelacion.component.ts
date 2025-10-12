import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { MotivoCancelacionService } from '../../core/services/motivo-cancelacion.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MotivoCancelacion, MotivoCancelacionCreate, MotivoCancelacionUpdate } from '../../shared/models';
import { setFormErrorsFromApi } from '../../shared/utils/form-errors.util';

@Component({
  selector: 'app-motivos-cancelacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './motivos-cancelacion.component.html',
  styleUrl: './motivos-cancelacion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MotivosCancelacionComponent implements OnInit {
  private readonly service = inject(MotivoCancelacionService);
  private readonly fb = inject(FormBuilder);

  readonly items = signal<MotivoCancelacion[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly selectedItem = signal<MotivoCancelacion | null>(null);
  readonly confirmDeleteOpen = signal(false);
  readonly itemToDelete = signal<MotivoCancelacion | null>(null);
  readonly hasItems = computed(() => this.items().length > 0);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]]
  });

  ngOnInit(): void {
    this.loadItems();
  }

  trackById(_: number, item: MotivoCancelacion): number {
    return item.id;
  }

  startCreate(): void {
    this.error.set(null);
    this.selectedItem.set(null);
    this.showForm.set(true);
    this.form.reset({ nombre: '', descripcion: '' });
  }

  startEdit(item: MotivoCancelacion): void {
    this.error.set(null);
    this.selectedItem.set(item);
    this.showForm.set(true);
    this.form.reset({ nombre: item.nombre, descripcion: item.descripcion });
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

    const payload = this.buildPayload();
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
          this.error.set('No se pudo guardar el motivo de cancelación. Revisa los datos e inténtalo nuevamente.');
          setFormErrorsFromApi(this.form, error);
        }
      });
  }

  promptDelete(item: MotivoCancelacion): void {
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
          this.error.set('No se pudo eliminar el motivo de cancelación. Inténtalo nuevamente.');
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
        error: () => this.error.set('No se pudieron cargar los motivos de cancelación.')
      });
  }

  private buildPayload(): MotivoCancelacionCreate | MotivoCancelacionUpdate {
    const raw = this.form.getRawValue();
    return {
      nombre: raw.nombre.trim(),
      descripcion: raw.descripcion.trim()
    };
  }
}
