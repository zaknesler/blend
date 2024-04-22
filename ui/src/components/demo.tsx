import { createSignal } from 'solid-js';

export const Demo = () => {
  const [input, setInput] = createSignal('');

  const handleClick = async () => {
    if (!input()) return;
    alert('clicky');
  };

  return (
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <input
          type="text"
          value={input()}
          onChange={e => setInput(e.target.value)}
          class="w-full rounded-md px-3 py-2 font-sans text-sm"
        />
        <button
          onClick={handleClick}
          class="flex-shrink-0 rounded-md bg-gray-500 px-4 py-2 font-sans text-sm font-semibold text-white"
        >
          Get feed
        </button>
      </div>
    </div>
  );
};
