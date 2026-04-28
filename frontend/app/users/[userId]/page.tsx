import { RoutePlaceholderPage } from "@/components/route-placeholder-page";

interface UserProfilePageProps {
  params: {
    userId: string;
  };
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  return (
    <RoutePlaceholderPage
      title={`유저 프로필 ${params.userId}`}
      description="다른 유저의 프로필, 코디, 좋아요 수를 보여줄 상세 화면 자리입니다."
      focus="가벼운 소셜 범위만 유지하고 채팅이나 거래 기능은 추가하지 않을 예정입니다."
    />
  );
}
