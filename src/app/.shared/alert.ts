import sweetalert2 from 'sweetalert2';

export class Alert {
    static error(message: string, title: string = 'Erro'): void {
        sweetalert2(title, message, 'error');
    }

    static success(message: string, title: string = 'Sucesso'): void {
        sweetalert2(title, message, 'success');
    }
}
