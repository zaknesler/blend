import { TextField, type TextFieldRootProps } from '@kobalte/core/text-field';
import { cx } from 'class-variance-authority';
import { type Component, createMemo, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { getFieldError } from '~/api';
import * as classes from '~/constants/ui/input';

type TextInputProps = Omit<TextFieldRootProps<HTMLInputElement>, 'validationState' | 'name'> & {
  name: string;
  label: string;
  class?: string;
  error?: Error | null;
  placeholder?: string;
  multiline?: boolean;
};

export const TextInput: Component<TextInputProps> = props => {
  const [local, rest] = splitProps(props, ['name', 'label', 'class', 'error', 'ref', 'placeholder', 'multiline']);

  const error = createMemo(() => getFieldError(local.error, local.name));

  return (
    <TextField
      {...rest}
      validationState={error() ? 'invalid' : 'valid'}
      class={cx('flex flex-col items-stretch gap-1', local.class)}
    >
      <TextField.Label
        class={cx(
          'select-none text-gray-600 text-sm dark:text-gray-400',
          !!error() && 'text-red-700 dark:text-red-500',
        )}
      >
        {local.label}
      </TextField.Label>
      <Dynamic
        component={local.multiline ? TextField.TextArea : TextField.Input}
        ref={local.ref}
        class={classes.input({ disabled: props.disabled, error: !!error() })}
        placeholder={local.placeholder}
      />
      <TextField.ErrorMessage class="font-medium text-red-700 text-xs dark:text-red-500">
        {error()?.[0].message}
      </TextField.ErrorMessage>
    </TextField>
  );
};
