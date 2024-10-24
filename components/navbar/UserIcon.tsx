import { LuUserCircle2 } from "react-icons/lu";
import { fetchProfileImage } from "@/app/utils/actions";
import Image from "next/image";

async function UserIcon() {
  const profileImage = await fetchProfileImage();
  if (profileImage) {
    return (
      <Image
        src={profileImage}
        alt="User Profile Image"
        className="w-6 h-6 rounded-full object-cover"
        width={24}
        height={24}
      />
    );
  }
  return (
    <LuUserCircle2 className="w-6 h-6 bg-primary rounded-full text-white" />
  );
}
export default UserIcon;
