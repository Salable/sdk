import {ApiKeyAuthenticationProvider, ApiKeyLocation, type SerializationWriterFactoryRegistry} from "@microsoft/kiota-abstractions";
import {FetchRequestAdapter} from "@microsoft/kiota-http-fetchlibrary";
import {createSalable} from "./sdk/salable";
import {NullSafeJsonSerializationWriterFactory} from "./serialization";

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
    // Must run after createSalable, which registers the stock JSON serializer;
    // re-registering replaces the application/json factory with the null-safe one.
    const writerRegistry = adapter.getSerializationWriterFactory() as SerializationWriterFactoryRegistry;
    if (writerRegistry.registerDefaultSerializer) {
      writerRegistry.registerDefaultSerializer(NullSafeJsonSerializationWriterFactory);
    }
  }
}
