import { AtSymbolIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { Button, Divider, TextInput } from '@mantine/core';
import { useUser } from '@supabase/auth-helpers-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useUserData } from '../../hooks/useUserData';
import LoadingIndicator from '../common/LoadingIndicator';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import WorkspaceInviteSnippet from '../notifications/WorkspaceInviteSnippet';
import { mutate } from 'swr';
import { Workspace } from '../../types/primitives/Workspace';
import { DEV_MODE } from '../../constants/common';
import {
  DEFAULT_DISPLAY_NAME,
  DEFAULT_USERNAME,
} from '../../constants/development';

const OnboardingForm = () => {
  const router = useRouter();
  const user = useUser();

  const { data, updateData } = useUserData();

  const [displayName, setDisplayName] = useState('');
  const [handle, setUsername] = useState('');

  const [profileCompleted, setProfileCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data) return;

    const hasDisplayName = (data?.display_name || '')?.length > 0;
    const hasUsername = (data?.handle || '')?.length > 0;

    setProfileCompleted(hasDisplayName && hasUsername);
    if (hasDisplayName && hasUsername) return;

    setDisplayName(data?.display_name || DEV_MODE ? DEFAULT_DISPLAY_NAME : '');
    setUsername(data?.handle || DEV_MODE ? DEFAULT_USERNAME : '');
  }, [data]);

  const updateProfile = async () => {
    setSaving(true);

    await updateData?.({
      display_name: displayName,
      handle,
    });

    setSaving(false);
  };

  const { workspaces, workspaceInvites } = useWorkspaces();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const res = await fetch('/api/workspaces');
      const data = await res.json();
      if (data[0]?.id) router.push(`/${data[0].id}`);
    };

    if (!workspaces || !workspaces?.length || !workspaces[0]?.id) return;
    if (!profileCompleted) return;

    // If there is a redirectedFrom URL, redirect to it
    // Otherwise, redirect to the homepage
    const { redirectedFrom: nextUrl } = router.query;

    if (nextUrl) router.push(nextUrl.toString());
    else fetchWorkspaces();
  }, [router, workspaces, profileCompleted]);

  const acceptInvite = async (ws: Workspace) => {
    const response = await fetch(`/api/workspaces/${ws.id}/invites`, {
      method: 'POST',
    });

    if (response.ok) {
      mutate('/api/workspaces');
      showNotification({
        title: `Đã chấp nhận lời mời vào ${ws.name}`,
        message: 'Bạn có thể truy cập vào tổ chức này ngay bây giờ',
      });
    } else {
      showNotification({
        title: `Không thể chấp nhận lời mời vào ${ws.name}`,
        message: 'Vui lòng thử lại sau',
      });
    }
  };

  const declineInvite = async (ws: Workspace) => {
    const response = await fetch(`/api/workspaces/${ws.id}/invites`, {
      method: 'DELETE',
    });

    if (response.ok) {
      mutate('/api/workspaces');
    } else {
      showNotification({
        title: `Không thể từ chối lời mời vào ${ws.name}`,
        message: 'Vui lòng thử lại sau',
      });
    }
  };

  return (
    <>
      <div className="absolute inset-0 mx-4 my-32 flex items-start justify-center md:mx-4 md:items-center lg:mx-32">
        <div className="flex w-full max-w-xl flex-col items-center gap-4 rounded-xl bg-zinc-700/50 p-4 backdrop-blur-2xl md:p-8">
          {!user ||
          !workspaces ||
          (workspaces && workspaces?.length > 0 && profileCompleted) ? (
            <LoadingIndicator className="h-8 w-8" />
          ) : (
            <>
              <div className="text-center">
                <div className="bg-gradient-to-br from-yellow-200 via-green-200 to-green-300 bg-clip-text py-2 text-4xl font-semibold text-transparent md:text-5xl">
                  {profileCompleted ? 'Còn chút nữa thôi!' : 'Chào mừng!'}
                </div>

                <div className="text-xl font-semibold text-zinc-200">
                  {profileCompleted
                    ? 'Chấp nhận lời mời để bắt đầu trải nghiệm'
                    : 'Hãy dành một chút thời gian để hoàn thành thông tin cá nhân của bạn.'}
                </div>
              </div>

              {profileCompleted || (
                <>
                  <Divider className="w-full border-zinc-300/20" />
                  <div className="w-full rounded-lg bg-green-300/10 p-4 text-center text-green-300">
                    <div className="text-lg font-semibold opacity-70">
                      Currently logged in as
                    </div>
                    <Divider
                      className="my-2 w-full border-green-300/20"
                      variant="dashed"
                    />
                    <div className="text-2xl font-semibold">{user?.email}</div>
                  </div>
                </>
              )}

              <Divider className="w-full border-zinc-300/20" />

              {profileCompleted ? (
                <div className="grid w-full gap-4">
                  {(workspaceInvites?.length || 0) > 0 ? (
                    workspaceInvites?.map((ws) => (
                      <WorkspaceInviteSnippet
                        key={ws.id}
                        ws={ws}
                        onAccept={acceptInvite}
                        onDecline={declineInvite}
                      />
                    ))
                  ) : (
                    <div className="text-center text-2xl font-semibold text-zinc-500">
                      Chưa có lời mời nào
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid w-full gap-2">
                  <TextInput
                    id="display-name"
                    icon={<UserCircleIcon className="h-5" />}
                    label="Tên hiển thị"
                    placeholder="Trần Văn A"
                    value={displayName}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setDisplayName(event.currentTarget.value)
                    }
                    classNames={{
                      label: 'text-zinc-200/80 mb-1',
                      input:
                        'bg-zinc-300/10 border-zinc-300/10 placeholder-zinc-200/30',
                    }}
                    disabled={saving}
                    autoComplete="off"
                  />

                  <TextInput
                    id="handle"
                    icon={<AtSymbolIcon className="h-5" />}
                    label="Tên đăng nhập"
                    placeholder="tranvana"
                    value={handle}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setUsername(event.currentTarget.value)
                    }
                    classNames={{
                      label: 'text-zinc-200/80 mb-1',
                      input:
                        'bg-zinc-300/10 border-zinc-300/10 placeholder-zinc-200/30',
                    }}
                    disabled={saving}
                    autoComplete="off"
                  />
                </div>
              )}

              {profileCompleted || (
                <div className="grid w-full gap-2 text-center">
                  <Button
                    className="bg-blue-300/10"
                    variant="light"
                    loading={saving}
                    onClick={updateProfile}
                  >
                    Lưu
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OnboardingForm;
