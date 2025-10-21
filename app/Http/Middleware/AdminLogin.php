<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminLogin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Check for admin session cookie
        if ($request->cookie('is_admin') !== '1') {
            return redirect('/admin-login')->withErrors(['Please login as admin']);
        }
        return $next($request);
    }
}
