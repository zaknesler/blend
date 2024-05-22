/* eslint-disable solid/no-innerhtml */

import { cx } from 'class-variance-authority';
import { JSX, ParentComponent, splitProps, For } from 'solid-js';
import type { Entry } from '~/types/bindings';
import { Link } from '../ui/link';
import { Button } from '../ui/button';
import { formatDateTime } from '~/utils/date';

type EntryViewProps = JSX.IntrinsicElements['div'] & {
  entry: Entry;
  breadcrumbs?: string[];
};

export const EntryView: ParentComponent<EntryViewProps> = props => {
  const [local, rest] = splitProps(props, ['class', 'entry', 'breadcrumbs']);

  const getDate = () => local.entry.published_at || local.entry.updated_at;

  return (
    <div {...rest} class={cx('flex flex-col gap-4', local.class)}>
      {local.breadcrumbs && (
        <nav class="flex items-baseline gap-1 text-sm">
          <For each={local.breadcrumbs}>
            {text => (
              <>
                <span class="select-none self-center text-gray-400 dark:text-gray-500">/</span>
                <Link href="/">{text}</Link>
              </>
            )}
          </For>
        </nav>
      )}

      <article class="flex flex-col gap-4">
        <h1 class="text-balance text-xl font-bold text-gray-800 lg:text-2xl dark:text-gray-100">{local.entry.title}</h1>

        {!!getDate() && <div class="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(getDate()!)}</div>}

        {local.entry.summary && (
          <h4
            class="prose prose-stone max-w-none text-base text-gray-500 dark:prose-invert lg:text-lg dark:text-gray-300"
            innerHTML={local.entry.summary}
          />
        )}

        <div class="h-1 w-32 bg-gray-300 dark:bg-gray-700" />
        {local.entry.content_html || local.entry.content_scraped_html ? (
          <div
            class={cx(
              'prose prose-sm max-w-none lg:prose-base',
              'prose-stone dark:prose-invert prose-pre:text-sm prose-pre:md:text-base',
              'prose-headings:font-bold prose-h1:text-2xl/5 prose-h2:text-xl/5 prose-h3:text-lg/5 prose-h4:text-base/5',
            )}
            innerHTML={local.entry.content_html || local.entry.content_scraped_html}
          />
        ) : (
          <div class="flex max-w-xs flex-col items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <p>There is no content for this entry.</p>
            <Button size="xs">Re-scrape content</Button>
          </div>
        )}
      </article>
    </div>
  );
};
