import { ReactElement, useEffect } from 'react';
import { useSegments } from '../../../hooks/useSegments';
import { PageWithLayoutProps } from '../../../types/PageWithLayoutProps';
import NestedLayout from '../../../components/layouts/NestedLayout';
import HeaderX from '../../../components/metadata/HeaderX';
import { useWorkspaces } from '../../../hooks/useWorkspaces';
import useTranslation from 'next-translate/useTranslation';
import { enforceRootWorkspace } from '../../../utils/serverless/enforce-root-workspace';
import StatisticCard from '../../../components/cards/StatisticCard';
import useSWR from 'swr';

export const getServerSideProps = enforceRootWorkspace;

const InfrastructureOverviewPage: PageWithLayoutProps = () => {
  const { setRootSegment } = useSegments();
  const { ws } = useWorkspaces();

  const { t } = useTranslation('infrastructure-tabs');

  const infrastructureLabel = t('infrastructure');
  const overviewLabel = t('overview');
  const usersLabel = t('users');
  const workspacesLabel = t('workspaces');

  useEffect(() => {
    setRootSegment(
      ws
        ? [
            {
              content: ws?.name || 'Tổ chức không tên',
              href: `/${ws.id}`,
            },
            { content: infrastructureLabel, href: `/${ws.id}/infrastructure` },
            { content: overviewLabel, href: `/${ws.id}/infrastructure` },
          ]
        : []
    );

    return () => setRootSegment([]);
  }, [infrastructureLabel, overviewLabel, ws, setRootSegment]);

  const usersCountApi = ws?.id ? `/api/users/count` : null;

  const workspacesCountApi = ws?.id ? `/api/workspaces/count` : null;

  const { data: users } = useSWR<number>(usersCountApi);
  const { data: workspaces } = useSWR<number>(workspacesCountApi);

  return (
    <>
      <HeaderX label={`${overviewLabel} – ${infrastructureLabel}`} />
      <div className="grid flex-col gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatisticCard
          title={usersLabel}
          value={users}
          href={`/${ws?.id}/infrastructure/users`}
        />

        <StatisticCard
          title={workspacesLabel}
          value={workspaces}
          href={`/${ws?.id}/infrastructure/workspaces`}
        />
      </div>
    </>
  );
};

InfrastructureOverviewPage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout mode="infrastructure">{page}</NestedLayout>;
};

export default InfrastructureOverviewPage;