import { getRelevantLimit } from './upload-file';

describe('Upload File', () => {
  it('should get correct limit', () => {
    const fileSizeLimits = {
      general: 1.4,
      pdf: 13,
      xlsx: 2,
      'application/pdf': 12,
    };

    expect(getRelevantLimit(fileSizeLimits, 'data.pdf', 'brokenMimeType')).toEqual(13);
    expect(getRelevantLimit(fileSizeLimits, 'brokenName', 'application/pdf')).toEqual(12);
    expect(getRelevantLimit(fileSizeLimits, 'brokenName', 'brokenMimeType')).toEqual(1.4);
    expect(getRelevantLimit(fileSizeLimits, 'data.csv', 'brokenMimeType')).toEqual(1.4);
    expect(getRelevantLimit(fileSizeLimits, 'brokenName', 'text/plain')).toEqual(1.4);
    // conflicting information will resolve to the one which has a limit specified
    expect(getRelevantLimit(fileSizeLimits, 'data.xlsx', 'text/plain')).toEqual(2);
    // MimeType beats name
    expect(getRelevantLimit(fileSizeLimits, 'data.xlsx', 'application/pdf')).toEqual(12);
  });
});
