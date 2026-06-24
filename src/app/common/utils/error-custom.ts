import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { of } from 'rxjs';

export class ErrorCustom {
  static handle(error: any) {
    if (error?.message) {
      if (error?.message) {
        throw new RpcException({
          message: error?.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }

    if (error?.status) {
      throw new RpcException({
        statusCode: error.status,
        message: error.response,
      });
    }

    throw new RpcException(error.response.data);
  }

  static handleError(error: any) {
    this.handle(error);

    return of(null);
  }
}
