import { useNavigate } from '@solidjs/router';
import { DEFAULTS } from '~/constants/query';
import { VIEWS, VIEW_LABELS } from '~/constants/views';
import { useQueryState } from '~/contexts/query-state-context';
import type { View } from '~/types/bindings';
import { formatQueryString } from '~/utils/query';
import { Tabs } from '../ui/tabs';

export const NavViewTabs = () => {
  const state = useQueryState();
  const navigate = useNavigate();

  const handleSetView = (view: View) => {
    if (state.getView() === view) return;

    const path = state.getFeedUrl(undefined, false).concat(
      formatQueryString({
        ...state.query,
        view: view === DEFAULTS.view ? undefined : view,
      }),
    );

    navigate(path);
  };

  return (
    <Tabs
      items={VIEWS.map(value => ({ value, label: VIEW_LABELS[value] }))}
      value={state.getView()}
      onChange={value => handleSetView(value as View)}
    />
  );
};
