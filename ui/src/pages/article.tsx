import dayjs from 'dayjs';
import article from '../article.json';
import { A, type RouteSectionProps } from '@solidjs/router';

export default ({ params }: RouteSectionProps) => {
  console.log(params.slug);

  return (
    <main class="flex flex-col gap-4">
      <nav class="flex items-baseline gap-2 text-sm">
        {article.breadcrumbs.map((text, index) => (
          <>
            <A href="/">{text}</A>
            {index !== article.breadcrumbs.length - 1 && <span class="select-none self-center text-gray-400">/</span>}
          </>
        ))}
      </nav>

      <article class="flex flex-col gap-4">
        <h1 class="text-balance text-2xl font-bold leading-7 text-gray-800">{article.title}</h1>
        <div class="text-sm text-gray-500">{dayjs(article.date).format('MMMM DD, YYYY [at] h:mm a')}</div>
        {article.teaser && <h4 class="text-lg leading-6 text-gray-500">{article.teaser}</h4>}

        <div class="h-1 w-32 bg-gray-300"></div>

        <div class="flex flex-col gap-4 leading-6">
          {article.text.split('\n').map(line => (
            <p>{line}</p>
          ))}
        </div>
      </article>
    </main>
  );
};
