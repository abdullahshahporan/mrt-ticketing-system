<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="csrf-token" content="{{ csrf_token() }}" />
  <title>{{ $oneTimeData['title'] ?? 'One-Time Ticketing' }}</title>
  <meta name="description" content="{{ $oneTimeData['description'] ?? 'One-Time Ticketing System' }}" />
  @vite(['resources/css/app.css','resources/js/main.tsx'])
</head>
<body class="min-h-screen">
  <div id="app"></div>
  <!-- Pass data to React app -->
  <script>
    window.oneTimeData = @json($oneTimeData ?? []);
  </script>
</body>
</html>
