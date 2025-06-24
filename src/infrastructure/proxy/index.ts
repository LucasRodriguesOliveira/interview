import { Provider } from '@nestjs/common';

export class Proxy {
  constructor(
    private readonly token: symbol,
    private readonly provider: Provider,
  ) {}

  get Token(): symbol {
    return this.token;
  }

  get Provider(): Provider {
    return this.Provider;
  }

  get Entry(): [symbol, Provider] {
    return [this.token, this.provider];
  }
}
