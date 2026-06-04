import { Injectable } from '@nestjs/common';
import { EmailAdapter } from 'src/application/services/email.adapter';

@Injectable()
export class StubEmailAdapter extends EmailAdapter {
  sendPasswordResetEmail(
    _email: string,
    _name: string,
    _token: string,
  ): Promise<void> {
    return Promise.resolve();
  }

  sendInviteEmail(
    _email: string,
    _churchName: string,
    _inviterName: string,
    _token: string,
  ): Promise<void> {
    return Promise.resolve();
  }
}
