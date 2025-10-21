<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\AdminProfile;
use App\Http\Controllers\Controller;

class AdminProfileController extends Controller
{
    // Store new admin profile
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admin_profile,email',
            'contact_no' => 'required|string|max:20',
            'nid_no' => 'required|string|max:20',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string|max:255',
        ]);
        $profile = AdminProfile::create($validated);
        return response()->json($profile, 201);
    }

    // Show admin profile by ID
    public function show($id)
    {
        $profile = AdminProfile::findOrFail($id);
        return response()->json($profile);
    }
}
