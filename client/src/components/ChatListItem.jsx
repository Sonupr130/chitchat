import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatListItem = ({ chat }) => {
  return (
    <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
      <Avatar className="h-10 w-10 mr-3 object-cover">
        <AvatarImage className="object-cover" src={chat.avatar} alt={chat.name} />
        <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-medium truncate">{chat.name}</span>
          <span className="text-xs text-gray-500">{chat.time}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{chat.message}</p>
      </div>
    </div>
  );
}

export default ChatListItem;