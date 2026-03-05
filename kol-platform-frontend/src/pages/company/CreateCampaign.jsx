import { useState } from "react";
import { addCampaign } from "../../utils/campaignStore";
import { useAuth } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";

function CreateCampaign() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    deliverables: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
    audience: "",
    platform: "",
    country: "",
    files: null,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    setLoading(true);
    setSuccess(false);

    // simulate API delay
    await new Promise((res) => setTimeout(res, 800));

    const newCampaign = {
  id: Date.now(),

  title: form.title,
  brand: form.title, // brand name fix

  description: form.description,
  deliverables: form.deliverables,

  budgetMin: Number(form.budgetMin),
  budgetMax: Number(form.budgetMax),

  //  for older UI components
  budget: `${form.budgetMin} - ${form.budgetMax}`,

  deadline: form.deadline,
  audience: form.audience,
  platform: form.platform,
  country: form.country,

  status: "active",
  companyEmail: user.email,

  createdAt: new Date().toISOString(),
};

    //  Save to localStorage
    addCampaign(newCampaign);

    setLoading(false);
    setSuccess(true);

    // Reset form
    setForm({
      title: "",
      description: "",
      deliverables: "",
      budgetMin: "",
      budgetMax: "",
      deadline: "",
      audience: "",
      platform: "",
      country: "",
      files: null,
    });

    // Redirect after short delay
    setTimeout(() => {
      navigate("/company/campaigns");
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Campaign</h1>
        <p className="text-gray-500">
          Launch a new influencer campaign
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-lg">
           Campaign created successfully!
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-6 space-y-6"
      >
        {/* Campaign Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Campaign Title
          </label>
          <input
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Summer Fashion Campaign"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            required
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Describe campaign goals..."
          />
        </div>

        {/* Deliverables */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Deliverables
          </label>
          <input
            name="deliverables"
            required
            value={form.deliverables}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="2 Instagram Reels + 3 Stories"
          />
        </div>

        {/* Budget */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Min Budget ($)
            </label>
            <input
              name="budgetMin"
              type="number"
              required
              value={form.budgetMin}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Max Budget ($)
            </label>
            <input
              name="budgetMax"
              type="number"
              required
              value={form.budgetMax}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Deadline
          </label>
          <input
            name="deadline"
            type="date"
            required
            value={form.deadline}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Target */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Target Audience
            </label>
            <input
              name="audience"
              required
              value={form.audience}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="18-25, Fashion lovers"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Required Platform
            </label>
            <select
              name="platform"
              required
              value={form.platform}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select platform</option>
              <option>Instagram</option>
              <option>YouTube</option>
              <option>TikTok</option>
              <option>X</option>
            </select>
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Target Country
          </label>
          <input
            name="country"
            required
            value={form.country}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="India"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Attach Files
          </label>
          <input
            name="files"
            type="file"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Publishing..." : "Publish Campaign"}
        </button>
      </form>
    </div>
  );
}

export default CreateCampaign;