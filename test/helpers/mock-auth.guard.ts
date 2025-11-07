import { CanActivate, ExecutionContext } from '@nestjs/common';

export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}