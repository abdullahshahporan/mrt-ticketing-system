<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="csrf-token" content="{{ csrf_token() }}" />
  <title>One Time Ticket Booking</title>
  <meta name="description" content="Choose your preferred booking method for a convenient metro rail journey" />
  @vite(['resources/css/app.css'])
</head>
<body>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold text-center mb-4">One Time Ticket Booking</h1>
    <p class="text-center text-gray-600 mb-8">Choose your preferred booking method</p>

    <div class="flex gap-6 justify-center">
      <a href="/instant-booking" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700">Instant Booking</a>
  <a href="/one-time-ticket/schedule-booking" class="inline-block bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700">Schedule For Later</a>
    </div>
  </div>
</body>
</html>
