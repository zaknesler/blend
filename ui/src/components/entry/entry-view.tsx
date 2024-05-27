import { cx } from 'class-variance-authority';
import { For, type JSX, type ParentComponent, splitProps } from 'solid-js';
import type { Entry } from '~/types/bindings';
import { formatDateTime } from '~/utils/date';
import { getEntryDate } from '~/utils/entries';
import { Button } from '../ui/button';
import { Link } from '../ui/link';

type EntryViewProps = JSX.IntrinsicElements['div'] & {
  entry: Entry;
  breadcrumbs?: string[];
};

export const EntryView: ParentComponent<EntryViewProps> = props => {
  const [local, rest] = splitProps(props, ['class', 'entry', 'breadcrumbs']);

  const getDate = () => getEntryDate(local.entry);

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
        <h1
          class="text-balance font-bold text-gray-800 text-xl dark:text-gray-100 lg:text-2xl"
          innerHTML={local.entry.title}
        />

        {!!getDate() && <div class="text-gray-500 text-sm dark:text-gray-400">{formatDateTime(getDate()!)}</div>}

        {local.entry.summary_html && (
          <h4
            class="prose prose-stone dark:prose-invert max-w-none text-base text-gray-500 dark:text-gray-300 lg:text-lg"
            innerHTML={local.entry.summary_html}
          />
        )}

        <div class="h-1 w-32 bg-gray-300 dark:bg-gray-700" />

        {local.entry.content_scraped_html || local.entry.content_html ? (
          <div
            class={cx(
              'prose prose-sm lg:prose-base max-w-none',
              'prose-stone dark:prose-invert prose-pre:md:text-base prose-pre:text-sm',
              'prose-headings:font-bold prose-h1:text-2xl/5 prose-h2:text-xl/5 prose-h3:text-lg/5 prose-h4:text-base/5',
            )}
            innerHTML={local.entry.content_scraped_html || local.entry.content_html}
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
