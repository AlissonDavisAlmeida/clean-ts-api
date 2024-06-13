export class AccountAlreadyExistsError extends Error {
  constructor () {
    super('The received email is already in use');
    this.name = AccountAlreadyExistsError.name;
  }
}
