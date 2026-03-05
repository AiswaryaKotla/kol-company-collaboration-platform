import { useState } from "react";

function KolProfile() {
  const [form, setForm] = useState({
    bio: "",
    niche: "",
    location: "",
    languages: "",
    audience: "",
    mediaKit: null,
    portfolio: null,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSave = () => {
    localStorage.setItem("kolProfile", JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Profile Completion</h2>

      {saved && (
        <div className="bg-green-100 text-green-600 p-3 rounded-lg mb-4">
          Profile saved successfully 
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        <textarea
          name="bio"
          placeholder="Bio"
          className="w-full border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          name="niche"
          placeholder="Niche"
          className="w-full border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          className="w-full border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          name="languages"
          placeholder="Languages"
          className="w-full border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          name="audience"
          placeholder="Audience Demographics"
          className="w-full border p-3 rounded-lg"
          onChange={handleChange}
        />

        <div>
          <label className="block mb-1 font-medium">
            Media Kit Upload
          </label>
          <input type="file" name="mediaKit" onChange={handleChange} />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Portfolio Upload
          </label>
          <input type="file" name="portfolio" onChange={handleChange} />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}

export default KolProfile;