import { useState, useEffect } from "react";
import { useAuth } from "../../store/AuthContext";

function CompanyProfile() {
  const { user } = useAuth();
  const storageKey = `company_profile_${user?.email}`;

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    logo: "",
    companyName: user?.companyName || "",
    description: "",
    website: "",
    industry: "",
    country: "",
    verified: true, // UI badge
  });

  //  Load saved profile
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setProfile(JSON.parse(saved));
  }, [storageKey]);

  //  Save profile
  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify(profile));
    setIsEditing(false);
  };

  //  Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  //  Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, logo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Company Profile</h1>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Save Changes
          </button>
        )}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* Logo Section */}
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
            {profile.logo ? (
              <img
                src={profile.logo}
                alt="logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">No Logo</span>
            )}
          </div>

          {isEditing && (
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
          )}

          {profile.verified && (
            <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
               Verified Company
            </span>
          )}
        </div>

        {/* Form Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="companyName"
            value={profile.companyName}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Company Name"
            className="border p-3 rounded-lg"
          />

          <input
            name="website"
            value={profile.website}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Website"
            className="border p-3 rounded-lg"
          />

          <input
            name="industry"
            value={profile.industry}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Industry"
            className="border p-3 rounded-lg"
          />

          <input
            name="country"
            value={profile.country}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Country"
            className="border p-3 rounded-lg"
          />
        </div>

        {/* Description */}
        <textarea
          name="description"
          value={profile.description}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="Company Description"
          className="w-full border p-3 rounded-lg mt-4 min-h-[120px]"
        />
      </div>
    </div>
  );
}

export default CompanyProfile;