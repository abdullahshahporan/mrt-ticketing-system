<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Cookie;

class AdminAuthController extends Controller
{
    // Show login blade
    public function showLogin()
    {
        return view('admin.login');
    }

    // Handle login POST
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        $username = $request->input('username');
        $password = $request->input('password');

        // default credentials
        if ($username === 'admin' && $password === '123456') {
            Cookie::queue('is_admin', '1', 120);
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json(['success' => true, 'redirect' => url('/admin-dashboard')]);
            }
            return redirect()->route('admin.dashboard');
        }

        if ($request->ajax() || $request->wantsJson()) {
            return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
        }
        return redirect()->back()->withErrors(['Invalid credentials'])->withInput();
    }

    // Dashboard (protected by simple cookie)
    public function dashboard(Request $request)
    {
        $isAdmin = $request->cookie('is_admin');
        if (!$isAdmin) {
            return redirect()->route('admin.login')->withErrors(['Please login as admin']);
        }

        return view('admin.dashboard');
    }

    // Logout
    public function logout(Request $request)
    {
        Cookie::queue(Cookie::forget('is_admin'));
        return redirect()->route('admin.login');
    }
}
