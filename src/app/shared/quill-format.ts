import Quill from 'quill';

export function importQuillFormatWithWhitelist(path: string) {
  const format = Quill.import(path);
  if (typeof format !== 'function') {
    throw new TypeError(`Quill format "${path}" is not a constructor.`);
  }

  return Object.assign(format, { whitelist: [] as string[] });
}
