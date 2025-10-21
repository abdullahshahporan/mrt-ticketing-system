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
        // Minimalistic: Accept all fields, no validation
        $profile = AdminProfile::create($request->all());
        return response()->json($profile, 201);
    }

    // Show admin profile by ID
    public function show($id)
    {
        $profile = AdminProfile::findOrFail($id);
        return response()->json($profile);
    }
}
