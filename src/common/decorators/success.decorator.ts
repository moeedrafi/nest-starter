import { SetMetadata } from '@nestjs/common';

export const SuccessMessage = (message: string) =>
  SetMetadata('success_message', message);
