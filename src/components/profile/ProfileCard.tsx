import { useAppSelector } from "@/src/lib/redux/hooks";
import { IdCard, MailIcon, MapIcon, PhoneIcon } from "lucide-react";

const ProfileCard = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="text-center text-red-500 p-8 animate-pulse">
        Profile not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8 m-8">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Basic Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <MailIcon className="text-blue-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-700">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <PhoneIcon className="text-blue-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-700">{user.phone || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <MapIcon className="text-blue-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-700">{`${
                    user?.address ? user?.address?.country : "N/A"
                  }`}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <IdCard className="text-blue-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="text-gray-700 text-sm font-mono">{user._id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-600">Created Account</span>
                <span className="text-gray-700">
                  {new Date(user?.createdAt!).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-700">
                  {new Date(user?.updatedAt!).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Info */}

        <div className="md:col-span-1 flex flex-col items-center p-6 bg-gradient-to-b from-blue-50 to-white rounded-xl">
          <div className="relative group">
            <img
              src={
                user.avatar ||
                "https://res.cloudinary.com/dglsw3gml/image/upload/v1742799359/bicycle-shop/avatar_jrnud5.jpg"
              }
              alt={user.name}
              className="w-40 h-40 rounded-full border-4 border-blue-500 shadow-lg object-cover"
            />
            <span
              className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${
                user.status === "active"
                  ? "bg-green-500 animate-pulse"
                  : "bg-gray-400"
              }`}
            ></span>
          </div>
          <h2 className="text-2xl font-bold mt-4 text-gray-800">{user.name}</h2>
          <span className="px-4 py-1.5 mt-3 bg-blue-500 text-white rounded-full text-sm font-medium">
            {user.role!.charAt(0).toUpperCase() + user.role!.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
