import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { HistorialPacienteService } from '../../core/services/historial-paciente.service';
import { PacienteService } from '../../core/services/paciente.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import {
  HistorialPaciente,
  HistorialPacienteCreate,
  HistorialPacienteUpdate,
  Paciente
} from '../../shared/models';
import { setFormErrorsFromApi } from '../../shared/utils/form-errors.util';

@Component({
  selector: 'app-historial-pacientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent, DatePipe],
  templateUrl: './historial-pacientes.component.html',
  styleUrl: './historial-pacientes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistorialPacientesComponent implements OnInit {
  private readonly historialService = inject(HistorialPacienteService);
  private readonly pacienteService = inject(PacienteService);
  private readonly fb = inject(FormBuilder);

  readonly items = signal<HistorialPaciente[]>([]);
  readonly pacientes = signal<Paciente[]>([]);
  readonly loading = signal(false);
  readonly pacientesLoading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly error = signal<string | null>(null);
  readonly auxError = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly selectedItem = signal<HistorialPaciente | null>(null);
  readonly confirmDeleteOpen = signal(false);
  readonly itemToDelete = signal<HistorialPaciente | null>(null);
  readonly hasItems = computed(() => this.items().length > 0);
  readonly hasPacientes = computed(() => this.pacientes().length > 0);

  readonly form = this.fb.nonNullable.group({
    pacienteId: [0, [Validators.required, Validators.min(1)]],
    evento: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    fecha: ['', [Validators.required]],
    observacion: ['', [Validators.maxLength(255)]]
  });

  ngOnInit(): void {
    this.loadPacientes();
    this.loadItems();
  }

  trackById(_: number, item: HistorialPaciente): number {
    return item.id;
  }

  trackByPacienteId(_: number, paciente: Paciente): number {
    return paciente.id;
  }

  pacienteNombre(id: number): string {
    const paciente = this.pacientes().find((item) => item.id === id);
    return paciente ? `${paciente.apellido}, ${paciente.nombre}` : '—';
  }

  startCreate(): void {
    this.error.set(null);
    this.selectedItem.set(null);
    this.showForm.set(true);
    this.form.reset({ pacienteId: 0, evento: '', fecha: '', observacion: '' });
  }

  startEdit(item: HistorialPaciente): void {
    this.error.set(null);
    this.selectedItem.set(item);
    this.showForm.set(true);
    this.form.reset({
      pacienteId: item.pacienteId,
      evento: item.evento,
      fecha: item.fecha,
      observacion: item.observacion ?? ''
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
      ? this.historialService.update(selected.id, payload)
      : this.historialService.create(payload);

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

  promptDelete(item: HistorialPaciente): void {
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
    this.historialService
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
          this.error.set('No se pudo eliminar el registro de historial. Inténtalo nuevamente.');
        }
      });
  }

  private loadPacientes(): void {
    this.pacientesLoading.set(true);
    this.pacienteService
      .list()
      .pipe(finalize(() => this.pacientesLoading.set(false)))
      .subscribe({
        next: (items) => this.pacientes.set(items),
        error: () => this.auxError.set('No se pudieron cargar los pacientes para el formulario.')
      });
  }

  private loadItems(): void {
    this.loading.set(true);
    this.historialService
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (items) => this.items.set(items),
        error: () => this.error.set('No se pudieron cargar los registros del historial.')
      });
  }

  private buildPayload(): HistorialPacienteCreate | HistorialPacienteUpdate {
    const raw = this.form.getRawValue();
    return {
      pacienteId: Number(raw.pacienteId),
      evento: raw.evento.trim(),
      fecha: raw.fecha,
      ...(raw.observacion?.trim() ? { observacion: raw.observacion.trim() } : {})
    };
  }

  private handleFormError(error: unknown): void {
    this.error.set('No se pudo guardar el registro del historial. Revisa los datos e inténtalo nuevamente.');
    setFormErrorsFromApi(this.form, error);
  }
}
