import {ApiKeyAuthenticationProvider, ApiKeyLocation} from "@microsoft/kiota-abstractions";
import {FetchRequestAdapter} from "@microsoft/kiota-http-fetchlibrary";
import {createSalable} from "./sdk/salable";

export class Salable {
  public readonly api: ReturnType<typeof createSalable>['api'];

  constructor(apiKey: string) {
    const authProvider = new ApiKeyAuthenticationProvider(
      'Bearer ' + apiKey,
      'Authorization',
      ApiKeyLocation.Header
    );
    const adapter = new FetchRequestAdapter(authProvider);
    this.api = createSalable(adapter).api;
  }
}