<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>{{ $appData['title'] ?? config('app.name','MRT Ticketing') }}</title>
  <meta name="description" content="{{ $appData['description'] ?? 'MRT Ticketing System' }}" />
  @vite(['resources/css/app.css','resources/js/main.tsx'])
</head>
<body class="min-h-screen">
  <div id="app"></div>
  
  <!-- Pass data to React app -->
  <script>
    window.appData = @json($appData ?? []);
  </script>
</body>
</html>
