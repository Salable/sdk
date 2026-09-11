import { type SerializationWriter } from '@microsoft/kiota-abstractions';
import { JsonSerializationWriter, JsonSerializationWriterFactory } from '@microsoft/kiota-serialization-json';

/**
 * Kiota's JsonSerializationWriter stringifies null enum values, producing
 * `"interval": "null"` instead of `"interval": null`, which the API rejects
 * with an invalid_enum_value error. Unlike every other write method, its
 * writeEnumValue/writeCollectionOfEnumValues only filter out undefined before
 * template-stringifying, so null slips through as the string "null".
 * See https://github.com/microsoft/kiota-typescript — present up to at least
 * 1.0.0-preview.107. This subclass emits a proper JSON null instead.
 */
export class NullSafeJsonSerializationWriter extends JsonSerializationWriter {
  public writeEnumValue = <T>(key?: string, ...values: (T | null | undefined)[]): void => {
    const provided = values.filter((x): x is T | null => x !== undefined);
    if (provided.length === 0) {
      return;
    }
    const rawValues = provided.filter((x): x is T => x !== null).map((x) => `${x}`);
    if (rawValues.length === 0) {
      this.writeNullValue(key);
      return;
    }
    this.writeStringValue(key, rawValues.join(', '));
  };

  public writeCollectionOfEnumValues = <T>(key?: string, values?: (T | null | undefined)[]): void => {
    if (values === null) {
      this.writeNullValue(key);
      return;
    }
    if (!values || values.length === 0) {
      return;
    }
    const rawValues = values
      .filter((x): x is T | null => x !== undefined)
      .map((x) => (x === null ? null : `${x}`));
    if (rawValues.length === 0) {
      return;
    }
    this.writeCollectionOfPrimitiveValues(key, rawValues);
  };
}

export class NullSafeJsonSerializationWriterFactory extends JsonSerializationWriterFactory {
  public getSerializationWriter(contentType: string): SerializationWriter {
    if (!contentType) {
      throw new Error('content type cannot be undefined or empty');
    }
    if (this.getValidContentType() !== contentType) {
      throw new Error(`expected a ${this.getValidContentType()} content type`);
    }
    return new NullSafeJsonSerializationWriter();
  }
}
