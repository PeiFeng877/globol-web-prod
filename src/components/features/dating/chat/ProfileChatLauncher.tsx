'use client';

/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 2026-02-08 新增个人页聊天入口组件；变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: profile id/name/locale + button style
 * OUTPUT: Say Hi launcher and modal controller
 * POS: features/dating/chat interaction layer
 * CONTRACT: Provides login-free AI chat entry for profile detail page.
 * 职责: 统一管理 Say Hi 按钮与弹窗开关。
 */

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n/client";
import ChatModal from "./ChatModal";

interface ProfileChatLauncherProps {
  profileId: string;
  profileName: string;
  locale: string;
  className?: string;
}

export default function ProfileChatLauncher({
  profileId,
  profileName,
  locale,
  className = "",
}: ProfileChatLauncherProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`gap-2 !bg-sky-500 !text-white hover:!bg-sky-600 focus:!ring-sky-500 ${className}`}
      >
        <MessageCircle size={14} />
        {t.datingChat.sayHi}
      </Button>
      <ChatModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        profileId={profileId}
        profileName={profileName}
        locale={locale}
      />
    </>
  );
}
