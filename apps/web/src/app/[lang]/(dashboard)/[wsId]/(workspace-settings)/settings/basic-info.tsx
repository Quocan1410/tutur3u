'use client';

import useTranslation from 'next-translate/useTranslation';
import { Workspace } from '@/types/primitives/Workspace';
import NameInput from './name-input';

interface Props {
  workspace?: Workspace | null;
  allowEdit?: boolean;
}

export default function BasicInfo({ workspace, allowEdit }: Props) {
  const { t } = useTranslation('ws-settings');

  if (!workspace) return null;

  return (
    <div className="border-border bg-foreground/5 flex flex-col rounded-lg border p-4">
      <div className="mb-1 text-2xl font-bold">{t('basic_info')}</div>
      <div className="text-foreground/80 mb-4 font-semibold">
        {t('basic_info_description')}
      </div>

      <NameInput
        wsId={workspace.id}
        defaultValue={workspace.name}
        disabled={!workspace || !allowEdit}
      />
    </div>
  );
}
