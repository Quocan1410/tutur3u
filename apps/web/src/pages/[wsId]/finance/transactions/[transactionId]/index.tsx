import { ReactElement, useEffect, useState } from 'react';
import HeaderX from '../../../../../components/metadata/HeaderX';
import { PageWithLayoutProps } from '../../../../../types/PageWithLayoutProps';
import { enforceHasWorkspaces } from '../../../../../utils/serverless/enforce-has-workspaces';
import NestedLayout from '../../../../../components/layouts/NestedLayout';
import { Button, Divider, NumberInput, Select, TextInput } from '@mantine/core';
import { useSegments } from '../../../../../hooks/useSegments';
import { useWorkspaces } from '../../../../../hooks/useWorkspaces';
import WalletSelector from '../../../../../components/selectors/WalletSelector';
import { Wallet } from '../../../../../types/primitives/Wallet';
import SettingItemCard from '../../../../../components/settings/SettingItemCard';
import TransactionCategorySelector from '../../../../../components/selectors/TransactionCategorySelector';
import { useRouter } from 'next/router';
import { Transaction } from '../../../../../types/primitives/Transaction';
import useSWR from 'swr';
import { DateTimePicker } from '@mantine/dates';
import useTranslation from 'next-translate/useTranslation';
import { EyeIcon } from '@heroicons/react/24/outline';
import 'dayjs/locale/vi';
import moment from 'moment';

export const getServerSideProps = enforceHasWorkspaces;

const TransactionDetailsPage: PageWithLayoutProps = () => {
  const { setRootSegment } = useSegments();
  const { ws } = useWorkspaces();

  const { t } = useTranslation('transactions');

  const finance = t('finance');
  const transactions = t('transactions');
  const unnamedWorkspace = t('unnamed-ws');
  const loading = t('common:loading');

  const informationLabel = t('transaction-details-tabs:information');

  const router = useRouter();
  const { wsId, transactionId } = router.query;

  const apiPath =
    wsId && transactionId
      ? `/api/workspaces/${wsId}/finance/transactions/${transactionId}`
      : null;

  const { data: transaction } = useSWR<Transaction>(apiPath);

  const walletApiPath =
    wsId && transaction?.wallet_id
      ? `/api/workspaces/${wsId}/finance/wallets/${transaction?.wallet_id}`
      : null;

  const { data: transactionWallet } = useSWR<Wallet>(walletApiPath);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    setRootSegment(
      ws && transaction
        ? [
            {
              content: ws?.name || unnamedWorkspace,
              href: `/${ws.id}`,
            },
            { content: finance, href: `/${ws.id}/finance` },
            {
              content: transactions,
              href: `/${ws.id}/finance/transactions`,
            },
            {
              content: transaction?.id || loading,
              href: `/${ws.id}/finance/transactions/${transaction?.id}`,
            },
            {
              content: informationLabel,
              href: `/${ws.id}/finance/transactions/${transaction?.id}`,
            },
          ]
        : []
    );

    return () => setRootSegment([]);
  }, [
    ws,
    transaction,
    setRootSegment,
    finance,
    transactions,
    informationLabel,
    unnamedWorkspace,
    loading,
  ]);

  const { lang } = useTranslation();

  return (
    <>
      <HeaderX label={`${transaction} - ${finance}`} />
      <div className="flex min-h-full w-full flex-col ">
        <div className="grid h-fit gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="col-span-full">
            <div className="text-2xl font-semibold">{t('basic-info')}</div>
            <Divider className="my-2" variant="dashed" />
          </div>

          <SettingItemCard
            title={t('wallets')}
            description={t('wallet-description')}
            disabled={!transactionWallet}
          >
            <div className="flex gap-2">
              <WalletSelector
                walletId={transaction?.wallet_id}
                wallet={wallet}
                setWallet={setWallet}
                className="w-full"
                preventPreselected
                hideLabel
                disabled
              />
              {ws?.id && transactionWallet?.id && (
                <Button
                  variant="light"
                  className="bg-blue-300/10"
                  onClick={() =>
                    router.push(
                      `/${ws.id}/finance/wallets/${transactionWallet.id}`
                    )
                  }
                >
                  <EyeIcon className="h-5 w-5" />
                </Button>
              )}
            </div>
          </SettingItemCard>

          <SettingItemCard
            title={t('description')}
            description={t('description-description')}
            disabled={!transactionWallet}
          >
            <TextInput
              placeholder={t('description-placeholder')}
              value={transaction?.description}
              disabled
            />
          </SettingItemCard>

          <SettingItemCard
            title={t('datetime')}
            description={t('datetime-description')}
            disabled={!transactionWallet}
          >
            <DateTimePicker
              value={
                transaction?.taken_at
                  ? moment(transaction?.taken_at).toDate()
                  : null
              }
              className="w-full"
              valueFormat="HH:mm - dddd, DD/MM/YYYY"
              locale={lang}
              disabled
            />
          </SettingItemCard>

          <SettingItemCard
            title={t('amount')}
            description={t('amount-description')}
            disabled={!transactionWallet}
          >
            <div className="grid gap-2">
              <NumberInput
                placeholder={t('amount-placeholder')}
                value={transaction?.amount}
                className="w-full"
                classNames={{
                  input: 'bg-white/5 border-zinc-300/20 font-semibold',
                }}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') || ''}
                formatter={(value) =>
                  !Number.isNaN(parseFloat(value || ''))
                    ? (value || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : ''
                }
                disabled
              />
            </div>
          </SettingItemCard>

          <SettingItemCard
            title={t('category')}
            description={t('category-description')}
            disabled={!transactionWallet}
          >
            <TransactionCategorySelector
              categoryId={transaction?.category_id}
              preventPreselected
              hideLabel
              disabled
            />
          </SettingItemCard>

          <SettingItemCard
            title={t('currency')}
            description={t('currency-description')}
            disabled={!transactionWallet}
          >
            <Select
              placeholder={t('currency-placeholder')}
              value={transactionWallet?.currency}
              data={[
                {
                  label: 'Việt Nam Đồng (VND)',
                  value: 'VND',
                },
              ]}
              disabled
              required
            />
          </SettingItemCard>
        </div>
      </div>
    </>
  );
};

TransactionDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout mode="transaction_details">{page}</NestedLayout>;
};

export default TransactionDetailsPage;
