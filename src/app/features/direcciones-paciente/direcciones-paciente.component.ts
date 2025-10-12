import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { DireccionPacienteService } from '../../core/services/direccion-paciente.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DireccionPaciente, DireccionPacienteCreate, DireccionPacienteUpdate } from '../../shared/models';
import { setFormErrorsFromApi } from '../../shared/utils/form-errors.util';

@Component({
  selector: 'app-direcciones-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './direcciones-paciente.component.html',
  styleUrl: './direcciones-paciente.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DireccionesPacienteComponent implements OnInit {
  private readonly service = inject(DireccionPacienteService);
  private readonly fb = inject(FormBuilder);

  readonly items = signal<DireccionPaciente[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly selectedItem = signal<DireccionPaciente | null>(null);
  readonly confirmDeleteOpen = signal(false);
  readonly itemToDelete = signal<DireccionPaciente | null>(null);
  readonly hasItems = computed(() => this.items().length > 0);

  readonly form = this.fb.nonNullable.group({
    calle: ['', [Validators.required, Validators.maxLength(150)]],
    numero: [0, [Validators.required, Validators.min(0)]],
    localidad: ['', [Validators.required, Validators.maxLength(120)]],
    provincia: ['', [Validators.required, Validators.maxLength(120)]],
    ccpp: ['', [Validators.maxLength(20)]]
  });

  ngOnInit(): void {
    this.loadItems();
  }

  trackById(_: number, item: DireccionPaciente): number {
    return item.id;
  }

  startCreate(): void {
    this.error.set(null);
    this.selectedItem.set(null);
    this.showForm.set(true);
    this.form.reset({ calle: '', numero: 0, localidad: '', provincia: '', ccpp: '' });
  }

  startEdit(item: DireccionPaciente): void {
    this.error.set(null);
    this.selectedItem.set(item);
    this.showForm.set(true);
    this.form.reset({
      calle: item.calle ?? '',
      numero: item.numero ?? 0,
      localidad: item.localidad ?? '',
      provincia: item.provincia ?? '',
      ccpp: item.ccpp ?? ''
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

  promptDelete(item: DireccionPaciente): void {
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
          this.error.set('No se pudo eliminar la dirección. Inténtalo nuevamente.');
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
        error: () => this.error.set('No se pudieron cargar las direcciones.')
      });
  }

  private buildPayload(): DireccionPacienteCreate | DireccionPacienteUpdate {
    const raw = this.form.getRawValue();
    return {
      calle: raw.calle.trim(),
      numero: Number(raw.numero),
      localidad: raw.localidad.trim(),
      provincia: raw.provincia.trim(),
      ...(raw.ccpp?.trim() ? { ccpp: raw.ccpp.trim() } : {})
    };
  }

  private handleFormError(error: unknown): void {
    this.error.set('No se pudo guardar la dirección. Revisa los datos e inténtalo nuevamente.');
    setFormErrorsFromApi(this.form, error);
  }
}
