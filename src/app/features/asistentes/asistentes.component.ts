import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AsistenteService } from '../../core/services/asistente.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { Asistente, AsistenteCreate, AsistenteUpdate } from '../../shared/models';
import { setFormErrorsFromApi } from '../../shared/utils/form-errors.util';

@Component({
  selector: 'app-asistentes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './asistentes.component.html',
  styleUrl: './asistentes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsistentesComponent implements OnInit {
  private readonly service = inject(AsistenteService);
  private readonly fb = inject(FormBuilder);

  readonly items = signal<Asistente[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly selectedItem = signal<Asistente | null>(null);
  readonly confirmDeleteOpen = signal(false);
  readonly itemToDelete = signal<Asistente | null>(null);
  readonly hasItems = computed(() => this.items().length > 0);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
    dni: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]]
  });

  ngOnInit(): void {
    this.loadItems();
  }

  trackById(_: number, item: Asistente): number {
    return item.id;
  }

  startCreate(): void {
    this.error.set(null);
    this.selectedItem.set(null);
    this.showForm.set(true);
    this.form.reset({ nombre: '', apellido: '', email: '', telefono: '', dni: '' });
  }

  startEdit(item: Asistente): void {
    this.error.set(null);
    this.selectedItem.set(item);
    this.showForm.set(true);
    this.form.reset({
      nombre: item.nombre,
      apellido: item.apellido,
      email: item.email,
      telefono: item.telefono,
      dni: item.dni.toString()
    });
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
        error: (error) => this.handleFormError(error)
      });
  }

  promptDelete(item: Asistente): void {
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
          this.error.set('No se pudo eliminar el asistente. Inténtalo nuevamente.');
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
        error: () => this.error.set('No se pudieron cargar los asistentes.')
      });
  }

  private buildPayload(): AsistenteCreate | AsistenteUpdate {
    const raw = this.form.getRawValue();
    return {
      nombre: raw.nombre.trim(),
      apellido: raw.apellido.trim(),
      email: raw.email.trim(),
      telefono: raw.telefono.trim(),
      dni: Number(raw.dni.trim())
    };
  }

  private handleFormError(error: unknown): void {
    this.error.set('No se pudo guardar el asistente. Revisa los datos e inténtalo nuevamente.');
    setFormErrorsFromApi(this.form, error);
  }
}
