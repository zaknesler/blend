import { Component, mergeProps } from 'solid-js';
import { ContextButton, type ContextButtonProps } from '../ui/context-button';

export const FeedContextButton: Component<ContextButtonProps> = props => {
  const local = mergeProps(
    {
      triggerClass: 'h-5 w-5',
      triggerIconClass: 'w-4 h-4 text-gray-500',
    },
    props,
  );

  return (
    <ContextButton {...local}>
      <ContextButton.Item onClick={() => alert('refresh')}>Refresh</ContextButton.Item>
      <ContextButton.Item onClick={() => alert('rename')}>Rename</ContextButton.Item>
      <ContextButton.Item onClick={() => alert('delete')}>Delete</ContextButton.Item>
    </ContextButton>
  );
};
