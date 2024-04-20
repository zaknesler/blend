import { Demo } from '~/components/demo';
import { useFeedContext } from '~/contexts/feed';

export default () => {
  const { feeds, setFeeds } = useFeedContext();

  const handleClick = () => {
    setFeeds(value => [
      ...value,
      {
        id: '1',
        title: 'Test',
        published_at: null,
        updated_at: null,
        entries: [],
      },
    ]);
  };

  return (
    <main class="flex flex-col gap-4">
      <Demo />

      <button onClick={handleClick}>add feed</button>
    </main>
  );
};
