import { CommonModule, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { HabitacionPacienteService } from '../../core/services/habitacion-paciente.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { HabitacionPaciente, HabitacionPacienteCreate, HabitacionPacienteUpdate } from '../../shared/models';
import { setFormErrorsFromApi } from '../../shared/utils/form-errors.util';

@Component({
  selector: 'app-habitaciones-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent, DecimalPipe],
  templateUrl: './habitaciones-paciente.component.html',
  styleUrl: './habitaciones-paciente.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HabitacionesPacienteComponent implements OnInit {
  private readonly service = inject(HabitacionPacienteService);
  private readonly fb = inject(FormBuilder);

  readonly items = signal<HabitacionPaciente[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly selectedItem = signal<HabitacionPaciente | null>(null);
  readonly confirmDeleteOpen = signal(false);
  readonly itemToDelete = signal<HabitacionPaciente | null>(null);
  readonly hasItems = computed(() => this.items().length > 0);

  readonly form = this.fb.nonNullable.group({
    numeroHabitacion: [1, [Validators.required, Validators.min(1)]],
    piso: [0, [Validators.required]],
    sector: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    camasDisponibles: [0, [Validators.required, Validators.min(0)]],
    descripcion: ['', [Validators.maxLength(200)]]
  });

  ngOnInit(): void {
    this.loadItems();
  }

  trackById(_: number, item: HabitacionPaciente): number {
    return item.id;
  }

  startCreate(): void {
    this.error.set(null);
    this.selectedItem.set(null);
    this.showForm.set(true);
    this.form.reset({ numeroHabitacion: 1, piso: 0, sector: '', camasDisponibles: 0, descripcion: '' });
  }

  startEdit(item: HabitacionPaciente): void {
    this.error.set(null);
    this.selectedItem.set(item);
    this.showForm.set(true);
    this.form.reset({
      numeroHabitacion: item.numeroHabitacion,
      piso: item.piso,
      sector: item.sector,
      camasDisponibles: item.camasDisponibles,
      descripcion: item.descripcion ?? ''
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
          this.error.set('No se pudo guardar la habitación. Revisa los datos e inténtalo nuevamente.');
          setFormErrorsFromApi(this.form, error);
        }
      });
  }

  promptDelete(item: HabitacionPaciente): void {
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
          this.error.set('No se pudo eliminar la habitación. Inténtalo nuevamente.');
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
        error: () => this.error.set('No se pudieron cargar las habitaciones.')
      });
  }

  private buildPayload(): HabitacionPacienteCreate | HabitacionPacienteUpdate {
    const raw = this.form.getRawValue();
    return {
      numeroHabitacion: Number(raw.numeroHabitacion),
      piso: Number(raw.piso),
      sector: raw.sector.trim(),
      camasDisponibles: Number(raw.camasDisponibles),
      descripcion: raw.descripcion?.trim() ? raw.descripcion.trim() : undefined
    };
  }
}
