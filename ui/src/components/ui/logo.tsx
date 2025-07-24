import { A, type AnchorProps } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { type Component, createUniqueId, mergeProps, Show, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

type LogoProps = Omit<AnchorProps, 'href'> & {
  iconOnly?: boolean;
};

export const Logo: Component<LogoProps> = props => {
  // Create a unique ID so the IDs don't clash when the component is used multiple times
  const id = createUniqueId();

  const [local, rest] = splitProps(props, ['class']);

  return (
    <A
      {...rest}
      href="/"
      class={cx(
        'shrink-0 select-none overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-500 focus-visible:ring-opacity-30 dark:focus-visible:ring-gray-600',
        local.class,
      )}
    >
      <svg
        class="h-auto w-20"
        viewBox="0 0 202 72"
        width="202"
        height="72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Blend logo</title>
        <rect width="202" height="72" fill={`url(#${id}-a)`} />
        <g filter={`url(#${id}-b)`}>
          <path
            d="M22.568 36.035c0-1.209.162-2.37.486-3.486.324-1.162.764-2.23 1.32-3.207L20 25.02 24.998 20l4.303 4.322c.972-.557 2.037-.999 3.194-1.324a12.77 12.77 0 0 1 3.47-.488c1.203 0 2.36.162 3.471.488 1.11.279 2.175.743 3.193 1.394L46.933 20 52 24.88l-4.373 4.392c.555.93.995 1.999 1.319 3.207a13.18 13.18 0 0 1 .486 3.556c0 1.255-.162 2.44-.486 3.555a12.03 12.03 0 0 1-1.32 3.207l4.235 4.253L46.933 52l-4.304-4.253c-.972.511-2.036.93-3.193 1.255-1.11.325-2.267.488-3.47.488-1.25 0-2.453-.14-3.61-.418a10.916 10.916 0 0 1-3.124-1.325l-4.234 4.183-4.929-4.95 4.304-4.252a14.005 14.005 0 0 1-1.388-3.207 14.382 14.382 0 0 1-.417-3.486Zm7.011 0c0 1.162.278 2.23.833 3.207a7.206 7.206 0 0 0 2.36 2.37 6.303 6.303 0 0 0 3.193.837c1.203 0 2.291-.28 3.263-.837 1.018-.604 1.804-1.394 2.36-2.37a5.996 5.996 0 0 0 .902-3.207c0-1.209-.3-2.3-.902-3.277a5.933 5.933 0 0 0-2.36-2.3c-.972-.605-2.06-.907-3.263-.907a5.931 5.931 0 0 0-3.193.907 6.594 6.594 0 0 0-2.36 2.3c-.555.976-.833 2.068-.833 3.277Z"
            fill="#fff"
            fill-opacity=".5"
            shape-rendering="crispEdges"
          />
        </g>
        <g filter={`url(#${id}-c)`}>
          <path
            d="M64.36 21.4h5.92v12.72h.28c.507-1.227 1.24-2.24 2.2-3.04.96-.8 2.267-1.2 3.92-1.2 1.147 0 2.187.213 3.12.64.96.427 1.773 1.08 2.44 1.96.693.88 1.227 2 1.6 3.36.4 1.36.6 2.973.6 4.84s-.2 3.48-.6 4.84c-.373 1.36-.907 2.48-1.6 3.36-.667.88-1.48 1.533-2.44 1.96-.933.427-1.973.64-3.12.64-1.653 0-2.96-.387-3.92-1.16-.96-.8-1.693-1.827-2.2-3.08h-.28V51h-5.92V21.4Zm9.76 25.48c1.333 0 2.36-.4 3.08-1.2.72-.827 1.08-1.96 1.08-3.4v-3.2c0-1.44-.36-2.56-1.08-3.36-.72-.827-1.747-1.24-3.08-1.24-1.04 0-1.947.253-2.72.76-.747.507-1.12 1.307-1.12 2.4v6.08c0 1.093.373 1.893 1.12 2.4.773.507 1.68.76 2.72.76Zm14.584-.48h6.32V26h-6.32v-4.6h12.24v25h6.32V51h-18.56v-4.6Zm33.825 5.08c-3.467 0-6.094-.96-7.88-2.88-1.787-1.92-2.68-4.533-2.68-7.84 0-1.68.226-3.187.68-4.52.48-1.36 1.146-2.507 2-3.44a8.36 8.36 0 0 1 3.16-2.16c1.253-.507 2.653-.76 4.2-.76 1.546 0 2.933.253 4.16.76 1.226.48 2.266 1.173 3.12 2.08.853.907 1.506 2.013 1.96 3.32.48 1.28.72 2.72.72 4.32v1.76h-14.12v.36c0 1.333.413 2.413 1.24 3.24.826.8 2.04 1.2 3.64 1.2 1.226 0 2.28-.227 3.16-.68a7.752 7.752 0 0 0 2.28-1.88l3.2 3.48c-.8.987-1.92 1.84-3.36 2.56s-3.267 1.08-5.48 1.08Zm-.48-17.36c-1.28 0-2.307.4-3.08 1.2-.747.773-1.12 1.827-1.12 3.16v.32h8.32v-.32c0-1.36-.374-2.427-1.12-3.2-.72-.773-1.72-1.16-3-1.16ZM136.553 51V30.36h5.92v3.76h.24c.24-.587.533-1.133.88-1.64.347-.507.76-.947 1.24-1.32a5.62 5.62 0 0 1 1.72-.92c.667-.24 1.413-.36 2.24-.36.987 0 1.893.173 2.72.52.827.32 1.533.813 2.12 1.48.587.667 1.04 1.48 1.36 2.44.347.96.52 2.067.52 3.32V51h-5.92V38.44c0-2.667-1.16-4-3.48-4a4.8 4.8 0 0 0-1.36.2 3.126 3.126 0 0 0-1.16.56c-.347.24-.627.547-.84.92-.187.373-.28.813-.28 1.32V51h-5.92Zm37.105-3.76h-.28c-.534 1.253-1.28 2.28-2.24 3.08-.934.773-2.227 1.16-3.88 1.16-1.147 0-2.2-.213-3.16-.64-.934-.427-1.747-1.08-2.44-1.96-.667-.88-1.2-2-1.6-3.36-.374-1.36-.56-2.973-.56-4.84s.186-3.48.56-4.84c.4-1.36.933-2.48 1.6-3.36.693-.88 1.506-1.533 2.44-1.96.96-.427 2.013-.64 3.16-.64.826 0 1.56.107 2.2.32.64.213 1.2.507 1.68.88a5.2 5.2 0 0 1 1.28 1.36c.373.507.693 1.067.96 1.68h.28V21.4h5.92V51h-5.92v-3.76Zm-3.84-.36c1.04 0 1.933-.253 2.68-.76.773-.507 1.16-1.307 1.16-2.4v-6.08c0-1.093-.387-1.893-1.16-2.4-.747-.507-1.64-.76-2.68-.76-1.334 0-2.36.413-3.08 1.24-.72.8-1.08 1.92-1.08 3.36v3.2c0 1.44.36 2.573 1.08 3.4.72.8 1.746 1.2 3.08 1.2Z"
            fill="#fff"
          />
        </g>
        <defs>
          <filter
            id={`${id}-b`}
            x="14"
            y="16"
            width="48"
            height="48"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dx="2" dy="4" />
            <feGaussianBlur stdDeviation="4" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_633_9" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_633_9" result="shape" />
          </filter>
          <filter
            id={`${id}-c`}
            x="58.36"
            y="17.4"
            width="131.217"
            height="46.08"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dx="2" dy="4" />
            <feGaussianBlur stdDeviation="4" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_633_9" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_633_9" result="shape" />
          </filter>
          <linearGradient id={`${id}-a`} x1="0" y1="0" x2="183.634" y2="104.327" gradientUnits="userSpaceOnUse">
            <stop stop-color="#78716C" />
            <stop offset="1" stop-color="#57534E" />
          </linearGradient>
        </defs>
      </svg>
    </A>
  );
};

export const LogoSquare: Component<LogoProps> = props => {
  // Create a unique ID so the IDs don't clash when the component is used multiple times
  const id = createUniqueId();

  const [_local, rest] = splitProps(props, ['class', 'iconOnly']);
  const local = mergeProps({ class: 'size-5' }, _local);

  const wrapperClass = cx('shrink-0 select-none overflow-hidden rounded-md', local.class);

  const icon = () => (
    <svg class="size-full" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72">
      <title>Blend logo</title>
      <rect width="72" height="72" fill={`url(#${id}-a)`} />
      <g filter={`url(#${id}-b)`}>
        <path
          d="M18.37 36.046c0-1.586.213-3.111.639-4.575a18.537 18.537 0 0 1 1.73-4.21L15 21.588 21.56 15l5.648 5.673a18.378 18.378 0 0 1 4.191-1.738 16.76 16.76 0 0 1 4.555-.64c1.58 0 3.098.213 4.556.64 1.458.366 2.854.976 4.19 1.83L50.35 15 57 21.405l-5.74 5.765c.73 1.22 1.306 2.623 1.731 4.21.425 1.524.638 3.08.638 4.666 0 1.647-.212 3.202-.638 4.666a15.786 15.786 0 0 1-1.73 4.21l5.557 5.581L50.349 57l-5.648-5.582a21.447 21.447 0 0 1-4.191 1.647c-1.458.427-2.976.64-4.556.64a20.15 20.15 0 0 1-4.737-.548 14.326 14.326 0 0 1-4.1-1.739l-5.557 5.49-6.469-6.496 5.649-5.582a18.382 18.382 0 0 1-1.822-4.21 18.869 18.869 0 0 1-.547-4.574Zm9.203 0c0 1.525.364 2.928 1.093 4.209a9.459 9.459 0 0 0 3.098 3.111c1.275.732 2.672 1.098 4.19 1.098 1.58 0 3.007-.366 4.282-1.098 1.337-.793 2.37-1.83 3.098-3.111a7.87 7.87 0 0 0 1.184-4.21c0-1.585-.394-3.019-1.184-4.3-.729-1.28-1.761-2.288-3.098-3.02-1.275-.793-2.702-1.19-4.282-1.19a7.784 7.784 0 0 0-4.19 1.19 8.655 8.655 0 0 0-3.098 3.02c-.729 1.281-1.093 2.715-1.093 4.3Z"
          fill="#fff"
          fill-opacity=".5"
          shape-rendering="crispEdges"
        />
      </g>
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="83.169" y2="16.842" gradientUnits="userSpaceOnUse">
          <stop stop-color="#78716C" />
          <stop offset="1" stop-color="#57534E" />
        </linearGradient>
        <filter
          id={`${id}-b`}
          x="9"
          y="11"
          width="58"
          height="58"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="2" dy="4" />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_633_12" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_633_12" result="shape" />
        </filter>
      </defs>
    </svg>
  );

  return (
    <Show
      when={!local.iconOnly}
      fallback={
        <div class={wrapperClass}>
          <Dynamic component={icon} />
        </div>
      }
    >
      <A
        href="/"
        {...rest}
        class={cx(
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-500 focus-visible:ring-opacity-30 dark:focus-visible:ring-gray-600',
          wrapperClass,
        )}
      >
        <Dynamic component={icon} />
      </A>
    </Show>
  );
};
