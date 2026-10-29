function ProfileCard({ user }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white text-3xl font-bold">
          {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>
          <h2 className="text-2xl font-bold">{user?.fullName}</h2>
          <p className="text-gray-500">{user?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
            🟢 {user?.role}
          </span>
        </div>
      </div>

      <div className="mt-6 border-t pt-4 space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">📞 Phone</span>
          <span>{user?.phone}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">📧 Email</span>
          <span>{user?.email}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">👤 Role</span>
          <span className="capitalize">{user?.role}</span>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;