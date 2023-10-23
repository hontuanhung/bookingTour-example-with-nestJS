import { SetMetadata } from '@nestjs/common';

export const IS_PROTECT = 'isProtect';
export const Protect = () => SetMetadata(IS_PROTECT, true);
