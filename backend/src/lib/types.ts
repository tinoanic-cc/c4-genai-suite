export function isString(value: any): value is string {
  return typeof value === 'string' || value instanceof String;
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

export function isObject(value: any): value is object {
  return !!value && typeof value === 'object' && (value as object).constructor === Object;
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

export function isNull(value: any): value is null {
  return value === null;
}

export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined';
}

export function isRegExp(value: any): value is RegExp {
  return !!value && typeof value === 'object' && (value as object).constructor === RegExp;
}

export function isDate(value: any): value is Date {
  return value instanceof Date;
}

export function is<TClass>(x: any, c: new (...args: any[]) => TClass): x is TClass {
  return x instanceof c;
}
