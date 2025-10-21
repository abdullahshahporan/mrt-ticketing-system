<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Admin Login - MRT Ticketing</title>
</head>
<body>
    <form method="POST" action="{{ route('admin.login.post') }}">
        @csrf
        @if($errors->any())
            <div>{{ $errors->first() }}</div>
        @endif
        <label for="username">Username</label>
        <input id="username" name="username" type="text" value="{{ old('username','admin') }}" autocomplete="username" />
        <label for="password">Password</label>
        <input id="password" name="password" type="password" value="123456" autocomplete="current-password" />
        <button type="submit">Login</button>
    </form>
</body>
</html>
