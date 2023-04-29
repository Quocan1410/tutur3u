import { Button, NumberInput, Select, TextInput } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import React, { useState } from 'react';
import { ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Wallet } from '../../types/primitives/Wallet';

interface Props {
  wsId: string;
  wallet?: Wallet;
  onSubmit: (wsId: string, wallet: Wallet) => void;
  onDelete?: () => void;
}

const WalletEditForm = ({ wsId, wallet, onSubmit, onDelete }: Props) => {
  const [name, setName] = useState(wallet?.name || '');
  const [balance, setBalance] = useState<number | ''>(wallet?.balance || '');
  const [currency, setCurrency] = useState<string | null>(
    wallet?.currency || 'VND'
  );
  const [description, setDescription] = useState(wallet?.description || '');

  return (
    <>
      <TextInput
        label="Wallet name"
        placeholder="Enter wallet name"
        value={name}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setName(event.currentTarget.value)
        }
        data-autofocus
      />

      <TextInput
        label="Description"
        placeholder="Enter description"
        value={description}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setDescription(event.currentTarget.value)
        }
      />

      <NumberInput
        label="Balance"
        placeholder="Enter balance"
        value={balance}
        onChange={setBalance}
        min={0}
        parser={(value) => value?.replace(/\$\s?|(,*)/g, '') || ''}
        formatter={(value) =>
          !Number.isNaN(parseFloat(value || ''))
            ? (value || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : ''
        }
      />

      <Select
        label="Currency"
        placeholder="Select currency"
        value={currency}
        onChange={setCurrency}
        data={[
          {
            value: 'VND',
            label: 'VND',
          },
        ]}
      />

      <div className="flex gap-2">
        {wallet?.id && onDelete && (
          <Button
            fullWidth
            variant="subtle"
            color="red"
            onClick={() => {
              onDelete();
            }}
            mt="md"
          >
            Delete
          </Button>
        )}
        <Button
          fullWidth
          variant="subtle"
          onClick={() => {
            const newWallet = {
              id: wallet?.id || uuidv4(),
              name,
              balance: balance || 0,
              currency: currency || 'VND',
              description,
            };

            onSubmit(wsId, newWallet);
            closeAllModals();
          }}
          mt="md"
          disabled={!name}
        >
          {wallet?.id ? 'Save' : 'Add'}
        </Button>
      </div>
    </>
  );
};

export default WalletEditForm;