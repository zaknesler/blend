import { Component, mergeProps } from 'solid-js';
import { ContextButton, type ContextButtonProps } from '../ui/context-button';
import { createMutation } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';
import { refreshFeed } from '~/api/feeds';

type FeedContextButtonProps = ContextButtonProps & {
  uuid: string;
};

export const FeedContextButton: Component<FeedContextButtonProps> = props => {
  const local = mergeProps(
    {
      triggerClass: 'h-5 w-5',
      triggerIconClass: 'w-4 h-4 text-gray-500',
    },
    props,
  );

  const refresh = createMutation(() => ({
    mutationKey: [QUERY_KEYS.FEEDS_VIEW_REFRESH],
    mutationFn: refreshFeed,
  }));

  const handleRefresh = () => {
    refresh.mutateAsync(props.uuid);
    props.setOpen(false);
  };

  return (
    <ContextButton {...local}>
      <ContextButton.Item onClick={handleRefresh}>Refresh</ContextButton.Item>
      <ContextButton.Item onClick={() => alert('rename')} disabled>
        Rename
      </ContextButton.Item>
      <ContextButton.Item onClick={() => alert('delete')} disabled>
        Delete
      </ContextButton.Item>
    </ContextButton>
  );
};
