import { describe, expect, it } from 'vitest';
import { SourceDto } from 'src/api';
import { mergeIdenticalSources } from './ChatItemSources';

describe('mergeIdenticalSources', () => {
  it('should return an empty array if the input is empty', () => {
    const result = mergeIdenticalSources([]);
    expect(result).toEqual([]);
  });

  it('should merge metadata and pages of sources with identical identities', () => {
    const sources: SourceDto[] = [
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', pages: ['1', '2'] },
      },
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', pages: ['4'] },
      },
    ];

    const result = mergeIdenticalSources(sources);
    expect(result).toEqual([
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', pages: '1-2, 4' },
      },
    ]);
  });

  it('should merge pages correctly and format them as ranges', () => {
    const sources: SourceDto[] = [
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { pages: ['1', '3', '5'] },
      },
      {
        title: 'Source 2',
        identity: { fileName: 'file2', sourceSystem: 'systemB' },
        metadata: { pages: ['5', '4', '1'] },
      },
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { pages: ['2', '4', '6'] },
      },
    ];

    const result = mergeIdenticalSources(sources);
    expect(result).toEqual([
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { pages: '1-6' },
      },
      {
        title: 'Source 2',
        identity: { fileName: 'file2', sourceSystem: 'systemB' },
        metadata: { pages: '1, 4-5' },
      },
    ]);
  });

  it('should not merge different sources', () => {
    const sources: SourceDto[] = [
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { pages: ['1', '3', '5'] },
      },
      {
        title: 'Source 2',
        identity: { fileName: 'file2', sourceSystem: 'systemB' },
        metadata: { pages: ['5', '4', '1'] },
      },
    ];

    const result = mergeIdenticalSources(sources);
    expect(result).toEqual(sources);
  });

  it('should merge different metadata values of sources with identical identities', () => {
    const sources: SourceDto[] = [
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'oneValue', pages: ['1', '2'] },
      },
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'otherValue', pages: ['4'] },
      },
    ];

    const result = mergeIdenticalSources(sources);
    expect(result).toEqual([
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'oneValue, otherValue', pages: '1-2, 4' },
      },
    ]);
  });

  it('should handle bad data input for pages (1)', () => {
    const sources: SourceDto[] = [
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', pages: ['1', '2'] },
      },
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', pages: [false, 5] },
      },
    ];

    const result = mergeIdenticalSources(sources);
    expect(result).toEqual([
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', pages: '1-2' },
      },
    ]);
  });

  it('should handle bad data input for pages (2)', () => {
    const sources: SourceDto[] = [
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', pages: [false] },
      },
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', pages: [1, 5] },
      },
    ];

    const result = mergeIdenticalSources(sources);
    expect(result).toEqual([
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', pages: '1, 5' },
      },
    ]);
  });

  it('should keep all metadata values from first source page', () => {
    const sources: SourceDto[] = [
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', key2: 'value2' },
      },
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1' },
      },
    ];

    const result = mergeIdenticalSources(sources);
    expect(result).toEqual([
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', key2: 'value2' },
      },
    ]);
  });

  it('should keep all metadata values from second source page', () => {
    const sources: SourceDto[] = [
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1' },
      },
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', key2: 'value2' },
      },
    ];

    const result = mergeIdenticalSources(sources);
    expect(result).toEqual([
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', key2: 'value2' },
      },
    ]);
  });

  it('should keep all metadata values from all source pages', () => {
    const sources: SourceDto[] = [
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', keyA: 'valueA' },
      },
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', keyB: 'valueB' },
      },
    ];

    const result = mergeIdenticalSources(sources);
    expect(result).toEqual([
      {
        title: 'Source 1',
        identity: { fileName: 'file1', sourceSystem: 'systemA' },
        metadata: { key1: 'value1', keyA: 'valueA', keyB: 'valueB' },
      },
    ]);
  });
});
