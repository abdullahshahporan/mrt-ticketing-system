<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\VirtualCard;

class VirtualCardAuth
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
        $email = $request->input('email');
        $password = $request->input('password');
        if (!$email || !$password) {
            return response()->json(['error' => 'Email and password required'], 401);
        }

        $card = VirtualCard::where('email', $email)->where('is_active', true)->first();
        if (!$card || !password_verify($password, $card->password)) {
            return response()->json(['error' => 'Invalid email or password'], 403);
        }

        // Optionally, attach card info to request
        $request->attributes->set('virtual_card', $card);

        return $next($request);
    }
}
