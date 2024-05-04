import dayjs from 'dayjs';
import { For } from 'solid-js';
import article from '../article.json';
import { Link } from '~/components/ui/link';

export default () => (
  <main class="flex max-w-4xl flex-col gap-4 font-serif">
    <nav class="flex items-baseline gap-1 text-sm">
      <For each={article.breadcrumbs}>
        {text => (
          <>
            <span class="select-none self-center text-gray-400 dark:text-gray-500">/</span>
            <Link href="/">{text}</Link>
          </>
        )}
      </For>
    </nav>

    <article class="flex flex-col gap-4">
      <h1 class="text-balance text-2xl font-bold leading-8 text-gray-800 dark:text-gray-100">{article.title}</h1>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {dayjs(article.date).format('MMMM DD, YYYY [at] h:mm a')}
      </div>
      {article.teaser && <h4 class="text-lg leading-7 text-gray-500 dark:text-gray-300">{article.teaser}</h4>}
      <div class="h-1 w-32 bg-gray-300 dark:bg-gray-700" />

      {/* eslint-disable-next-line solid/no-innerhtml */}
      <div class="flex flex-col gap-4 leading-6" innerHTML={article.html} />
    </article>
  </main>
);
