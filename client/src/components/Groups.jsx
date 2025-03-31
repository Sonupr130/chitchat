import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Search, Users } from "lucide-react";

const Groups = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const groups = [
    { id: 1, name: "Project Alpha Team", members: 5 },
    { id: 2, name: "Family Group", members: 8 },
    { id: 3, name: "Office Announcements", members: 23 },
    { id: 4, name: "Weekend Hangout", members: 6 },
  ];

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } w-[25vw] rounded-lg shadow-sm overflow-hidden`}
    >
      <div className="flex flex-col h-full">

        <div className="p-4 border-b">
          <h1 className="text-lg font-semibold">Build your Community</h1>
        </div>

        {/* Search bar */}
        <div className="p-3">
          <div className="relative">
            <input 
              type="text" 
              className="w-full pl-8 pr-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none"
              placeholder="Search"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
          </div>
        </div>


        <div className="overflow-y-auto h-full pb-20">
              {groups.map((group) => (
                <div key={group.id} className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full overflow-hidden flex items-center justify-center">
                        <Users size={20} />
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">{group.name}</h3>
                      <p className="text-xs text-gray-500">{group.members} members</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4">
                <button className="w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                  Create New Group
                </button>
              </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
