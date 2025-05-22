import { describe, expect, it } from 'vitest';
import { type Entry, SortDirection } from '~/types/bindings';
import { getEntryComparator } from '.';

const fakeEntry = (params: Pick<Entry, 'id' | 'published_at' | 'updated_at'>) => ({
  uuid: '00000000-0000-0000-0000-000000000000',
  feed_uuid: '00000000-0000-0000-0000-000000000000',
  url: 'https://example.com/example-post',
  title: 'Example Post',
  ...params,
});

describe(getEntryComparator, () => {
  it('can sort entries by newest first', () => {
    const entries = [
      fakeEntry({ id: 'some-id', published_at: '2024-05-01T00:00:00.000Z' }),
      fakeEntry({ id: 'another-id', published_at: '2024-05-02T00:00:00.000Z' }),
    ] as Entry[];

    const sorted = entries.sort(getEntryComparator(SortDirection.Newest));

    expect(sorted.map(entry => entry.id)).toStrictEqual(['another-id', 'some-id']);
  });

  it('can sort entries by newest first, using updated_at as a fallback', () => {
    const entries = [
      fakeEntry({ id: 'some-id', published_at: '2024-05-01T00:00:00.000Z' }),
      fakeEntry({ id: 'another-id', updated_at: '2024-05-02T00:00:00.000Z' }),
    ] as Entry[];

    const sorted = entries.sort(getEntryComparator(SortDirection.Newest));

    expect(sorted.map(entry => entry.id)).toStrictEqual(['another-id', 'some-id']);
  });

  it('can sort entries by oldest first', () => {
    const entries = [
      fakeEntry({ id: 'some-id', published_at: '2024-05-02T00:00:00.000Z' }),
      fakeEntry({ id: 'another-id', published_at: '2024-05-01T00:00:00.000Z' }),
    ] as Entry[];

    const sorted = entries.sort(getEntryComparator(SortDirection.Oldest));

    expect(sorted.map(entry => entry.id)).toStrictEqual(['another-id', 'some-id']);
  });

  it('can sort entries by oldest first, using updated_at as a fallback', () => {
    const entries = [
      fakeEntry({ id: 'some-id', published_at: '2024-05-02T00:00:00.000Z' }),
      fakeEntry({ id: 'another-id', updated_at: '2024-05-01T00:00:00.000Z' }),
    ] as Entry[];

    const sorted = entries.sort(getEntryComparator(SortDirection.Oldest));

    expect(sorted.map(entry => entry.id)).toStrictEqual(['another-id', 'some-id']);
  });
});
