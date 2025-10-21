import React, { useState } from 'react';

interface AdminProfile {
  profile_photo?: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  phone?: string;
  gender?: string;
  bio?: string;
}

const initialProfile: AdminProfile = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone: '',
  gender: 'Male',
  bio: '',
};

export function AdminProfileForm() {
  const [profile, setProfile] = useState<AdminProfile>(initialProfile);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      setPhotoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, gender: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save profile
    alert('Profile saved!');
  };

  return (
    <form className="max-w-xl mx-auto bg-white p-8 rounded shadow" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold mb-6">Profile</h2>
      <div className="flex items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
          {photoPreview ? (
            <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400">No photo</span>
          )}
        </div>
        <label className="block">
          <span className="sr-only">Upload photo</span>
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="block w-full text-sm text-gray-500" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">First name</label>
          <input type="text" name="first_name" value={profile.first_name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last name</label>
          <input type="text" name="last_name" value={profile.last_name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" name="password" value={profile.password} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Enter new password" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Optional" />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Gender</label>
        <div className="flex gap-6">
          <label className="flex items-center">
            <input type="radio" name="gender" value="Male" checked={profile.gender === 'Male'} onChange={handleGenderChange} className="mr-2" /> Male
          </label>
          <label className="flex items-center">
            <input type="radio" name="gender" value="Female" checked={profile.gender === 'Female'} onChange={handleGenderChange} className="mr-2" /> Female
          </label>
          <label className="flex items-center">
            <input type="radio" name="gender" value="Other" checked={profile.gender === 'Other'} onChange={handleGenderChange} className="mr-2" /> Other
          </label>
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">BIO</label>
        <textarea name="bio" value={profile.bio} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} placeholder="Type your messages..." />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="px-4 py-2 rounded border" onClick={() => setProfile(initialProfile)}>Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save changes</button>
      </div>
    </form>
  );
}