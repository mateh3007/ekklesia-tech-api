export abstract class EmailAdapter {
  abstract sendPasswordResetEmail(email: string, name: string, token: string): Promise<void>;
}
