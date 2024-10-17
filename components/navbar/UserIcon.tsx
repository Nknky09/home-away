import { LuUserCircle2 } from "react-icons/lu";
import { fetchProfileImage } from "@/app/utils/actions";

async function UserIcon() {
  const profileImage = await fetchProfileImage();
  if (profileImage) {
    return (
      <img src={profileImage} className="w-6 h-6 rounded-full object-cover" />
    );
  }
  return (
    <LuUserCircle2 className="w-6 h-6 bg-primary rounded-full text-white" />
  );
}
export default UserIcon;
