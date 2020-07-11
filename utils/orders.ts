export function mapErrorCodeToString(code: number) {
  switch (code) {
    case 0:
      return "Fallido";
    case 1:
      return "Pago procesado";
    case 2:
      return "Enviado";
    case 3:
      return "Completado";
    case 4:
      return "Cancelado";
    default:
      return 'Desconocido';
  }
}

export function mapOpenPayStatusCode(code: string) {
  switch (code) {
    case 'completed':
      return "Completado";
    case 'in_progress':
      return "Procesando";
    case 'failed':
      return "Fallido";
    default:
      return 'Desconocido';
  }
}