import { getTopInteractedTags } from "@/lib/actions/tag.actions";
import Image from "next/image";
import Link from "next/link";
import RenderTag from "../tag/RenderTag";
import { Badge } from "@/components/ui/badge";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: Props) => {
  const interactedTags = await getTopInteractedTags({ userId: user._id });
  return (
    <div className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-full  ">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Link
          href={`profile/${user.clerkId}`}
          className="flex flex-col items-center justify-center"
        >
          <Image
            src={user.picture}
            alt="user profile picture"
            width={100}
            height={100}
            className="rounded-full"
          />

          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">
              {user.name}
            </h3>
            <p className="text-dark500_light500 mt-2">@{user.username}</p>
          </div>
        </Link>

        <div className="mt-5">
          {interactedTags && interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags?.map((tag) => (
                <RenderTag key={tag._id} id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet.</Badge>
          )}
        </div>
      </article>
    </div>
  );
};
export default UserCard;
