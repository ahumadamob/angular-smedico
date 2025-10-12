import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormGroup } from '@angular/forms';

type ApiMessages = Record<string, string | string[]> | string[] | undefined;

function applyMessages(control: AbstractControl | null, message: string | string[]): void {
  if (!control) {
    return;
  }

  const text = Array.isArray(message) ? message.join(' ') : message;
  control.setErrors({ ...(control.errors ?? {}), api: text });
}

export function setFormErrorsFromApi(form: FormGroup, error: unknown): void {
  if (!(error instanceof HttpErrorResponse)) {
    return;
  }

  const payload = error.error ?? {};
  const messages: ApiMessages = payload.messages;

  if (messages && typeof messages === 'object' && !Array.isArray(messages)) {
    Object.entries(messages).forEach(([field, message]) => {
      applyMessages(form.get(field), message);
    });
  }

  if (Array.isArray(messages)) {
    messages.forEach((message, index) => {
      applyMessages(form.get(index.toString()), message);
    });
  }

  if (Array.isArray(payload.errors)) {
    payload.errors.forEach((fieldError: { field?: string; message?: string }) => {
      if (!fieldError.field || !fieldError.message) {
        return;
      }
      applyMessages(form.get(fieldError.field), fieldError.message);
    });
  }
}
