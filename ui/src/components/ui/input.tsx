import { TextField, type TextFieldRootProps } from '@kobalte/core/text-field';
import { cx } from 'class-variance-authority';
import { type Component, createMemo, splitProps } from 'solid-js';
import { getFieldError } from '~/api';
import * as classes from '~/constants/ui/input';

type TextInputProps = Omit<TextFieldRootProps<HTMLInputElement>, 'validationState' | 'name'> & {
  name: string;
  label: string;
  error?: Error | null;
  placeholder?: string;
};

export const TextInput: Component<TextInputProps> = props => {
  const [local, rest] = splitProps(props, ['name', 'label', 'error', 'ref', 'placeholder']);

  const error = createMemo(() => getFieldError(local.error, local.name));

  return (
    <TextField {...rest} validationState={error() ? 'invalid' : 'valid'} class="flex flex-col items-stretch gap-1">
      <TextField.Label
        class={cx('text-gray-600 text-sm dark:text-gray-400', !!error() && 'text-red-700 dark:text-red-500')}
      >
        {local.label}
      </TextField.Label>
      <TextField.Input
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
