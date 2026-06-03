export abstract class EmailAdapter {
  abstract sendPasswordResetEmail(email: string, name: string, token: string): Promise<void>;
  abstract sendInviteEmail(email: string, churchName: string, inviterName: string, token: string): Promise<void>;
}
