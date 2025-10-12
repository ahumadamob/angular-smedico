import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  private static nextId = 0;

  @Input() open = false;
  @Input() title = 'Confirmar acción';
  @Input() message = '¿Confirmas que deseas continuar?';
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  @Input() busyLabel = 'Procesando…';
  @Input() busy = false;
  @Input() confirmDestructive = false;

  @Output() readonly cancel = new EventEmitter<void>();
  @Output() readonly confirm = new EventEmitter<void>();

  readonly dialogId = `confirm-dialog-${ConfirmDialogComponent.nextId++}`;
  readonly titleId = `${this.dialogId}-title`;
  readonly messageId = `${this.dialogId}-message`;

  private emitCancel(): void {
    this.cancel.emit();
  }

  private emitConfirm(): void {
    this.confirm.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    if (!this.open || this.busy) {
      return;
    }

    event.preventDefault();
    this.emitCancel();
  }

  onBackdropClick(): void {
    if (this.busy) {
      return;
    }

    this.emitCancel();
  }

  onCancelClicked(event: Event): void {
    event.preventDefault();
    if (this.busy) {
      return;
    }

    this.emitCancel();
  }

  onConfirmClicked(event: Event): void {
    event.preventDefault();
    if (this.busy) {
      return;
    }

    this.emitConfirm();
  }

  get confirmButtonClass(): string {
    return this.confirmDestructive ? 'btn-danger' : 'btn-primary';
  }
}
