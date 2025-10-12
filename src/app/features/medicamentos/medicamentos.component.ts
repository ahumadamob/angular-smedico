import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { MedicamentoService } from '../../core/services/medicamento.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { Medicamento, MedicamentoCreate, MedicamentoUpdate } from '../../shared/models';
import { setFormErrorsFromApi } from '../../shared/utils/form-errors.util';

@Component({
  selector: 'app-medicamentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './medicamentos.component.html',
  styleUrl: './medicamentos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MedicamentosComponent implements OnInit {
  private readonly service = inject(MedicamentoService);
  private readonly fb = inject(FormBuilder);

  readonly items = signal<Medicamento[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly selectedItem = signal<Medicamento | null>(null);
  readonly confirmDeleteOpen = signal(false);
  readonly itemToDelete = signal<Medicamento | null>(null);
  readonly hasItems = computed(() => this.items().length > 0);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    presentacion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    dosisSugerida: ['', [Validators.maxLength(100)]]
  });

  ngOnInit(): void {
    this.loadItems();
  }

  trackById(_: number, item: Medicamento): number {
    return item.id;
  }

  startCreate(): void {
    this.error.set(null);
    this.selectedItem.set(null);
    this.showForm.set(true);
    this.form.reset({ nombre: '', presentacion: '', dosisSugerida: '' });
  }

  startEdit(item: Medicamento): void {
    this.error.set(null);
    this.selectedItem.set(item);
    this.showForm.set(true);
    this.form.reset({
      nombre: item.nombre,
      presentacion: item.presentacion,
      dosisSugerida: item.dosisSugerida ?? ''
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
        error: (error) => {
          this.error.set('No se pudo guardar el medicamento. Revisa los datos e inténtalo nuevamente.');
          setFormErrorsFromApi(this.form, error);
        }
      });
  }

  promptDelete(item: Medicamento): void {
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
          this.error.set('No se pudo eliminar el medicamento. Inténtalo nuevamente.');
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
        error: () => this.error.set('No se pudieron cargar los medicamentos.')
      });
  }

  private buildPayload(): MedicamentoCreate | MedicamentoUpdate {
    const raw = this.form.getRawValue();
    return {
      nombre: raw.nombre.trim(),
      presentacion: raw.presentacion.trim(),
      dosisSugerida: raw.dosisSugerida?.trim() ? raw.dosisSugerida.trim() : undefined
    };
  }
}
