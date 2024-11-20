import { isObjectIdOrHexString } from "mongoose";

type ValidatorType = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

interface ValidatorResult<T> {
  value: T;
  valid: boolean;
  message: string;
}

interface ValidationOptions {
  message?: string;
}


export default class Validator<T> {
  private value: T;
  private type: ValidatorType | null = null;
  private rules: Array<(value: T) => ValidatorResult<T>> = [];
  private isValid = true; // Flag to stop chain on type mismatch

  constructor(value: T) {
    this.value = value;
    this.type = typeof value;
  }

  private applyRule(
    isValid: boolean,
    defaultMessage: string,
    options?: ValidationOptions
  ): ValidatorResult<T> {
    const message = options?.message || defaultMessage;
    if (!isValid) this.isValid = false; // Stop further checks if invalid
    return isValid ? { value: this.value, valid: true, message: '' } : { value: this.value, valid: false, message };
  }

  validate(): ValidatorResult<T> {
    for (const rule of this.rules) {
      if (!this.isValid) return { value: this.value, valid: false, message: 'Validation stopped due to type mismatch' };
      const result = rule(this.value);
      if (!result.valid) return result; // Return the first validation error found
    }
    return { value: this.value, valid: true, message: 'Validation passed' };
  }

  // Set the expected type
  string(options?: ValidationOptions) {
    //this.type = 'string';
    this.rules.push(value => {
      if (!this.isValid) return { value, valid: false, message: '' }; // Skip if invalid
      return this.applyRule(
        typeof value === 'string',
        'Expected a string but received a different type',
        options
      );
    });
    return this;
  }

  number(options?: ValidationOptions) {
    //this.type = 'number';
    this.rules.push(value => {
      if (!this.isValid) return { value, valid: false, message: '' };
      return this.applyRule(
        typeof value === 'number',
        'Expected a number but received a different type',
        options
      );
    });
    return this;
  }

  boolean(options?: ValidationOptions) {
    //this.type = 'boolean';
    this.rules.push(value => {
      if (!this.isValid) return { value, valid: false, message: '' };
      return this.applyRule(
        typeof value === 'boolean',
        'Expected a boolean but received a different type',
        options
      );
    });
    return this;
  }

  true(value?: boolean, options?: ValidationOptions) {
    this.rules.push(input => {
      if (!this.isValid) return { value: input, valid: false, message: '' };
      return this.applyRule(
        value ? typeof input === 'boolean' && input === value : typeof input === 'boolean' && input === true,
        'Expected true but got false',
        options
      );
    });
    return this;
  }

  false(value?: boolean, options?: ValidationOptions) {
    this.rules.push(input => {
      if (!this.isValid) return { value: input, valid: false, message: '' };
      return this.applyRule(
        value ? typeof input === 'boolean' && input !== value : typeof input === 'boolean' && input === false,
        'Expected false but got true',
        options
      );
    });
    return this;
  }

  notEmpty(options?: ValidationOptions) {
    this.rules.push(value => {
      if (!this.isValid) return { value: this.value, valid: false, message: '' };
      return this.applyRule(
        typeof value === 'string' && value.trim().length > 0,
        'String cannot be empty',
        options
      );
    });
    return this;
  }

  equal(value: number | string | boolean, options?: ValidationOptions) {
    this.rules.push(input => {
      if (!this.isValid) return { value: input, valid: false, message: '' };
      return this.applyRule(
        input === value,
        'Values do not match',
        options
      );
    });
    return this;
  }

  startsWith(prefix: string, options?: ValidationOptions) {
    this.rules.push(value => {
      if (!this.isValid) return { value: this.value, valid: false, message: '' };
      return this.applyRule(
        typeof value === 'string' && value.startsWith(prefix),
        `String must start with "${prefix}"`,
        options
      );
    });
    return this;
  }

  endsWith(suffix: string, options?: ValidationOptions) {
    this.rules.push(value => {
      if (!this.isValid) return { value: this.value, valid: false, message: '' };
      return this.applyRule(
        typeof value === 'string' && value.endsWith(suffix),
        `String must end with "${suffix}"`,
        options
      );
    });
    return this;
  }

  includes(substring: string, options?: ValidationOptions) {
    this.rules.push(value => {
      if (!this.isValid) return { value: this.value, valid: false, message: '' };
      return this.applyRule(
        typeof value === 'string' && value.includes(substring),
        `String must include "${substring}"`,
        options
      );
    });
    return this;
  }

  trim() {
    this.rules.push(value => {
      if (!this.isValid) return { value: this.value, valid: false, message: '' };
      if (typeof value === 'string') {
        this.value = (value as string).trim() as T;  // Update this.value
        return { value: this.value, valid: true, message: '' };
      }
      return { value: this.value, valid: false, message: 'Value must be a string to trim' };
    });
    return this;
  }

  uppercase() {
    this.rules.push(value => {
      if (!this.isValid) return { value: this.value, valid: false, message: '' };
      if (typeof value === 'string') {
        this.value = (value as string).toUpperCase() as T;  // Update this.value
        return { value: this.value, valid: true, message: '' };
      }
      return { value: this.value, valid: false, message: 'Value must be a string to convert to uppercase' };
    });
    return this;
  }

  lowercase() {
    this.rules.push(value => {
      if (!this.isValid) return { value: this.value, valid: false, message: '' };
      if (typeof value === 'string') {
        this.value = (value as string).toLowerCase() as T;  // Update this.value
        return { value: this.value, valid: true, message: '' };
      }
      return { value: this.value, valid: false, message: 'Value must be a string to convert to lowercase' };
    });
    return this;
  }

  sentenceCase() {
    this.rules.push(value => {
      if (!this.isValid) return { value: this.value, valid: false, message: '' };
      if (typeof value === 'string') {
        const sentenceCased = value.replace(/(?:^|\s)\w/g, match => match.toUpperCase());
        this.value = sentenceCased as T;  // Update this.value
        return { value: this.value, valid: true, message: '' };
      }
      return { value: this.value, valid: false, message: 'Value must be a string to convert to sentence case' };
    });
    return this;
  }
  email(options?: ValidationOptions) {
    if (this.type !== 'string') {
      this.isValid = false;
      this.rules.push(() => this.applyRule(false, `Email validation requires a string value. Got a value with type ${this.type} instead`, options)); 
      return this;
    }
    this.rules.push(value => {
      if (!this.isValid) return { value: this.value, valid: false, message: '' };
      return this.applyRule(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as unknown as string),
        'Invalid email format',
        options
      );
    });
    return this;
  }


  url(options?: ValidationOptions) {
    if (this.type !== 'string') {
      this.isValid = false;
      this.rules.push(() => this.applyRule(false, `URL validation requires a string value. Got a value with type ${this.type} instead`, options));
      return this;
    }
    this.rules.push(value => {
      if (!this.isValid) return { value: this.value, valid: false, message: '' };
      return this.applyRule(
        /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/.test(value as unknown as string),
        'Invalid URL format',
        options
      );
    });
    return this; // Continue chaining
  }

  uuid(options?: ValidationOptions) {
    if (this.type !== 'string') {
      this.isValid = false;
      this.rules.push(() => this.applyRule(false, `UUID validation requires a string value. Got a value with type ${this.type} instead`, options));
      return this;
    }
    this.rules.push(value => {
      if (!this.isValid) return { value: this.value, valid: false, message: '' };
      return this.applyRule(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value as unknown as string),
        'Invalid UUID format',
        options
      );
    });
    return this;
  }

  objectId(options?: ValidationOptions) {
    this.rules.push(value => {
      if (!this.isValid) return { value: this.value, valid: false, message: '' };
      return this.applyRule(
        isObjectIdOrHexString(value),
        'Invalid Object ID format',
        options
      );
    });
    return this;
  }


  min(value: number, options?: ValidationOptions) {
    const message = this.type === 'number'
      ? `Number must be at least ${value}`
      : `String length must be at least ${value}`;
    this.rules.push(input => {
      if (!this.isValid) return { value: input, valid: false, message: '' };
      return this.applyRule(
        typeof input === 'number'
          ? (input as unknown as number) >= value
          : (input as unknown as string).length >= value,
        message,
        options
      );
    });
    return this;
  }

  max(value: number, options?: ValidationOptions) {
    const message = this.type === 'number'
      ? `Number must be at most ${value}`
      : `String length must be at most ${value}`;
    this.rules.push(input => {
      if (!this.isValid) return { value: input, valid: false, message: '' };
      return this.applyRule(
        typeof input === 'number'
          ? (input as unknown as number) <= value
          : (input as unknown as string).length <= value,
        message,
        options
      );
    });
    return this;
  }

  enum(values: T[], options?: ValidationOptions) {
    const message = `Value must be one of: ${values.join(', ')}`;
    this.rules.push(input => {
      if (!this.isValid) return { value: input, valid: false, message: '' };
      return this.applyRule(values.includes(input), message, options);
    });
    return this;
  } 
}
