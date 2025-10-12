import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { PacienteService } from '../../core/services/paciente.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { Paciente, PacienteCreate, PacienteUpdate } from '../../shared/models';
import { setFormErrorsFromApi } from '../../shared/utils/form-errors.util';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent, DatePipe],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PacientesComponent implements OnInit {
  private readonly service = inject(PacienteService);
  private readonly fb = inject(FormBuilder);

  readonly items = signal<Paciente[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly selectedItem = signal<Paciente | null>(null);
  readonly confirmDeleteOpen = signal(false);
  readonly itemToDelete = signal<Paciente | null>(null);
  readonly hasItems = computed(() => this.items().length > 0);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    dni: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]],
    email: ['', [Validators.required, Validators.email]],
    fechaNacimiento: [''],
    telefono: ['', [Validators.required, Validators.pattern(/^[+]?[0-9]{7,15}$/)]]
  });

  ngOnInit(): void {
    this.loadItems();
  }

  trackById(_: number, item: Paciente): number {
    return item.id;
  }

  startCreate(): void {
    this.error.set(null);
    this.selectedItem.set(null);
    this.showForm.set(true);
    this.form.reset({
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      fechaNacimiento: '',
      telefono: ''
    });
  }

  startEdit(item: Paciente): void {
    this.error.set(null);
    this.selectedItem.set(item);
    this.showForm.set(true);
    this.form.reset({
      nombre: item.nombre,
      apellido: item.apellido,
      dni: item.dni,
      email: item.email,
      fechaNacimiento: item.fechaNacimiento ?? '',
      telefono: item.telefono
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

  promptDelete(item: Paciente): void {
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
          this.error.set('No se pudo eliminar el paciente. Inténtalo nuevamente.');
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
        error: () => this.error.set('No se pudieron cargar los pacientes.')
      });
  }

  private buildPayload(): PacienteCreate | PacienteUpdate {
    const raw = this.form.getRawValue();
    const fechaNacimiento = raw.fechaNacimiento?.trim();

    return {
      nombre: raw.nombre.trim(),
      apellido: raw.apellido.trim(),
      dni: raw.dni.trim(),
      email: raw.email.trim(),
      telefono: raw.telefono.trim(),
      ...(fechaNacimiento ? { fechaNacimiento } : {})
    };
  }

  private handleFormError(error: unknown): void {
    this.error.set('No se pudo guardar el paciente. Revisa los datos e inténtalo nuevamente.');
    setFormErrorsFromApi(this.form, error);
  }
}
