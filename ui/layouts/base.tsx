import { ParentProps } from 'solid-js';
import { Link } from '../components/link';
import { HiSolidPlus } from 'solid-icons/hi';
import { useNavigate } from '@solidjs/router';

export const Base = ({ children }: ParentProps) => {
  const navigate = useNavigate();

  return (
    <div class="flex h-full w-full">
      <div class="flex h-full w-gutter flex-col gap-4 bg-gray-500 p-2">
        <button
          class="flex aspect-square items-center justify-center rounded-lg bg-gray-400 p-2 transition hover:bg-gray-600"
          onClick={() => {
            navigate('/new');
          }}
        >
          <HiSolidPlus class="h-6 w-6 text-white" />
        </button>
      </div>

      <div class="h-full w-sidebar bg-white shadow-md"></div>

      <div class="h-full w-full flex-1 overflow-y-auto overflow-x-hidden">
        <div class="flex max-w-4xl flex-col gap-8 p-8 font-serif md:p-16">
          <header class="flex items-center justify-between gap-4">
            <a href="/" class="select-none text-gray-500 transition-colors hover:text-gray-800">
              <svg
                class="h-auto w-16 fill-current"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 160 72"
                width="160"
                height="72"
              >
                <rect width="160" height="72" rx="16" fill="currentColor" />
                <path
                  d="M22.36 21.4h5.92v12.72h.28c.507-1.227 1.24-2.24 2.2-3.04.96-.8 2.267-1.2 3.92-1.2 1.147 0 2.187.213 3.12.64.96.427 1.773 1.08 2.44 1.96.693.88 1.227 2 1.6 3.36.4 1.36.6 2.973.6 4.84s-.2 3.48-.6 4.84c-.373 1.36-.907 2.48-1.6 3.36-.667.88-1.48 1.533-2.44 1.96-.933.427-1.973.64-3.12.64-1.653 0-2.96-.387-3.92-1.16-.96-.8-1.693-1.827-2.2-3.08h-.28V51h-5.92V21.4Zm9.76 25.48c1.333 0 2.36-.4 3.08-1.2.72-.827 1.08-1.96 1.08-3.4v-3.2c0-1.44-.36-2.56-1.08-3.36-.72-.827-1.747-1.24-3.08-1.24-1.04 0-1.947.253-2.72.76-.747.507-1.12 1.307-1.12 2.4v6.08c0 1.093.373 1.893 1.12 2.4.773.507 1.68.76 2.72.76Zm14.584-.48h6.32V26h-6.32v-4.6h12.24v25h6.32V51h-18.56v-4.6Zm33.825 5.08c-3.467 0-6.094-.96-7.88-2.88-1.787-1.92-2.68-4.533-2.68-7.84 0-1.68.226-3.187.68-4.52.48-1.36 1.146-2.507 2-3.44a8.362 8.362 0 0 1 3.16-2.16c1.253-.507 2.653-.76 4.2-.76 1.546 0 2.933.253 4.16.76 1.226.48 2.266 1.173 3.12 2.08.853.907 1.506 2.013 1.96 3.32.48 1.28.72 2.72.72 4.32v1.76h-14.12v.36c0 1.333.413 2.413 1.24 3.24.826.8 2.04 1.2 3.64 1.2 1.226 0 2.28-.227 3.16-.68a7.752 7.752 0 0 0 2.28-1.88l3.2 3.48c-.8.987-1.92 1.84-3.36 2.56s-3.267 1.08-5.48 1.08Zm-.48-17.36c-1.28 0-2.307.4-3.08 1.2-.747.773-1.12 1.827-1.12 3.16v.32h8.32v-.32c0-1.36-.374-2.427-1.12-3.2-.72-.773-1.72-1.16-3-1.16ZM94.553 51V30.36h5.92v3.76h.24c.24-.587.533-1.133.88-1.64.347-.507.76-.947 1.24-1.32a5.62 5.62 0 0 1 1.72-.92c.667-.24 1.413-.36 2.24-.36.987 0 1.893.173 2.72.52.827.32 1.533.813 2.12 1.48.587.667 1.04 1.48 1.36 2.44.347.96.52 2.067.52 3.32V51h-5.92V38.44c0-2.667-1.16-4-3.48-4a4.8 4.8 0 0 0-1.36.2 3.126 3.126 0 0 0-1.16.56c-.347.24-.627.547-.84.92-.187.373-.28.813-.28 1.32V51h-5.92Zm37.105-3.76h-.28c-.534 1.253-1.28 2.28-2.24 3.08-.934.773-2.227 1.16-3.88 1.16-1.147 0-2.2-.213-3.16-.64-.934-.427-1.747-1.08-2.44-1.96-.667-.88-1.2-2-1.6-3.36-.374-1.36-.56-2.973-.56-4.84s.186-3.48.56-4.84c.4-1.36.933-2.48 1.6-3.36.693-.88 1.506-1.533 2.44-1.96.96-.427 2.013-.64 3.16-.64.826 0 1.56.107 2.2.32.64.213 1.2.507 1.68.88a5.2 5.2 0 0 1 1.28 1.36c.373.507.693 1.067.96 1.68h.28V21.4h5.92V51h-5.92v-3.76Zm-3.84-.36c1.04 0 1.933-.253 2.68-.76.773-.507 1.16-1.307 1.16-2.4v-6.08c0-1.093-.387-1.893-1.16-2.4-.747-.507-1.64-.76-2.68-.76-1.334 0-2.36.413-3.08 1.24-.72.8-1.08 1.92-1.08 3.36v3.2c0 1.44.36 2.573 1.08 3.4.72.8 1.746 1.2 3.08 1.2Z"
                  fill="#fff"
                />
              </svg>
            </a>

            <nav class="flex items-baseline gap-4 text-sm">
              <Link href="/">Home</Link>
              <Link href="/article">Article</Link>
            </nav>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
};