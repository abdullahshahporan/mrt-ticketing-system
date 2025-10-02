<?php

namespace App\Services;

class FareService
{
    /**
     * Station fare matrix based on the MRT fare chart
     */
    private static $fareMatrix = [
        'uttara_north' => [
            'uttara_center' => 20, 'uttara_south' => 20, 'pallabi' => 30,
            'mirpur_11' => 30, 'mirpur_10' => 40, 'kazipara' => 40,
            'shewrapara' => 50, 'agargaon' => 60, 'bijoy_sarani' => 60,
            'farmgate' => 70, 'karwan_bazar' => 80, 'shahbag' => 80,
            'dhaka_university' => 90, 'bangladesh_secretariat' => 90,
            'motijheel' => 100
        ],
        'uttara_center' => [
            'uttara_north' => 20, 'uttara_south' => 20, 'pallabi' => 20,
            'mirpur_11' => 30, 'mirpur_10' => 30, 'kazipara' => 40,
            'shewrapara' => 40, 'agargaon' => 50, 'bijoy_sarani' => 60,
            'farmgate' => 60, 'karwan_bazar' => 70, 'shahbag' => 80,
            'dhaka_university' => 80, 'bangladesh_secretariat' => 90,
            'motijheel' => 100
        ],
        'uttara_south' => [
            'uttara_north' => 20, 'uttara_center' => 20, 'pallabi' => 20,
            'mirpur_11' => 20, 'mirpur_10' => 30, 'kazipara' => 30,
            'shewrapara' => 40, 'agargaon' => 40, 'bijoy_sarani' => 50,
            'farmgate' => 60, 'karwan_bazar' => 60, 'shahbag' => 70,
            'dhaka_university' => 80, 'bangladesh_secretariat' => 80,
            'motijheel' => 90
        ],
        'pallabi' => [
            'uttara_north' => 30, 'uttara_center' => 20, 'uttara_south' => 20,
            'mirpur_11' => 20, 'mirpur_10' => 20, 'kazipara' => 20,
            'shewrapara' => 30, 'agargaon' => 30, 'bijoy_sarani' => 40,
            'farmgate' => 50, 'karwan_bazar' => 50, 'shahbag' => 60,
            'dhaka_university' => 60, 'bangladesh_secretariat' => 70,
            'motijheel' => 80
        ],
        'mirpur_11' => [
            'uttara_north' => 30, 'uttara_center' => 30, 'uttara_south' => 20,
            'pallabi' => 20, 'mirpur_10' => 20, 'kazipara' => 20,
            'shewrapara' => 20, 'agargaon' => 30, 'bijoy_sarani' => 40,
            'farmgate' => 40, 'karwan_bazar' => 50, 'shahbag' => 60,
            'dhaka_university' => 60, 'bangladesh_secretariat' => 70,
            'motijheel' => 70
        ],
        'mirpur_10' => [
            'uttara_north' => 40, 'uttara_center' => 30, 'uttara_south' => 30,
            'pallabi' => 20, 'mirpur_11' => 20, 'kazipara' => 20,
            'shewrapara' => 20, 'agargaon' => 20, 'bijoy_sarani' => 30,
            'farmgate' => 30, 'karwan_bazar' => 40, 'shahbag' => 50,
            'dhaka_university' => 50, 'bangladesh_secretariat' => 60,
            'motijheel' => 60
        ],
        'kazipara' => [
            'uttara_north' => 40, 'uttara_center' => 40, 'uttara_south' => 30,
            'pallabi' => 20, 'mirpur_11' => 20, 'mirpur_10' => 20,
            'shewrapara' => 20, 'agargaon' => 20, 'bijoy_sarani' => 20,
            'farmgate' => 30, 'karwan_bazar' => 30, 'shahbag' => 40,
            'dhaka_university' => 50, 'bangladesh_secretariat' => 50,
            'motijheel' => 60
        ],
        'shewrapara' => [
            'uttara_north' => 50, 'uttara_center' => 40, 'uttara_south' => 40,
            'pallabi' => 30, 'mirpur_11' => 20, 'mirpur_10' => 20,
            'kazipara' => 20, 'agargaon' => 20, 'bijoy_sarani' => 20,
            'farmgate' => 20, 'karwan_bazar' => 30, 'shahbag' => 40,
            'dhaka_university' => 40, 'bangladesh_secretariat' => 50,
            'motijheel' => 50
        ],
        'agargaon' => [
            'uttara_north' => 60, 'uttara_center' => 50, 'uttara_south' => 40,
            'pallabi' => 30, 'mirpur_11' => 30, 'mirpur_10' => 20,
            'kazipara' => 20, 'shewrapara' => 20, 'bijoy_sarani' => 20,
            'farmgate' => 20, 'karwan_bazar' => 20, 'shahbag' => 30,
            'dhaka_university' => 40, 'bangladesh_secretariat' => 40,
            'motijheel' => 50
        ],
        'bijoy_sarani' => [
            'uttara_north' => 60, 'uttara_center' => 60, 'uttara_south' => 50,
            'pallabi' => 40, 'mirpur_11' => 40, 'mirpur_10' => 30,
            'kazipara' => 20, 'shewrapara' => 20, 'agargaon' => 20,
            'farmgate' => 20, 'karwan_bazar' => 20, 'shahbag' => 20,
            'dhaka_university' => 30, 'bangladesh_secretariat' => 30,
            'motijheel' => 40
        ],
        'farmgate' => [
            'uttara_north' => 70, 'uttara_center' => 60, 'uttara_south' => 60,
            'pallabi' => 50, 'mirpur_11' => 40, 'mirpur_10' => 30,
            'kazipara' => 30, 'shewrapara' => 20, 'agargaon' => 20,
            'bijoy_sarani' => 20, 'karwan_bazar' => 20, 'shahbag' => 20,
            'dhaka_university' => 20, 'bangladesh_secretariat' => 30,
            'motijheel' => 30
        ],
        'karwan_bazar' => [
            'uttara_north' => 80, 'uttara_center' => 70, 'uttara_south' => 60,
            'pallabi' => 50, 'mirpur_11' => 50, 'mirpur_10' => 40,
            'kazipara' => 30, 'shewrapara' => 30, 'agargaon' => 20,
            'bijoy_sarani' => 20, 'farmgate' => 20, 'shahbag' => 20,
            'dhaka_university' => 20, 'bangladesh_secretariat' => 20,
            'motijheel' => 30
        ],
        'shahbag' => [
            'uttara_north' => 80, 'uttara_center' => 80, 'uttara_south' => 70,
            'pallabi' => 60, 'mirpur_11' => 60, 'mirpur_10' => 50,
            'kazipara' => 40, 'shewrapara' => 40, 'agargaon' => 30,
            'bijoy_sarani' => 20, 'farmgate' => 20, 'karwan_bazar' => 20,
            'dhaka_university' => 20, 'bangladesh_secretariat' => 20,
            'motijheel' => 20
        ],
        'dhaka_university' => [
            'uttara_north' => 90, 'uttara_center' => 80, 'uttara_south' => 80,
            'pallabi' => 60, 'mirpur_11' => 60, 'mirpur_10' => 50,
            'kazipara' => 50, 'shewrapara' => 40, 'agargaon' => 40,
            'bijoy_sarani' => 30, 'farmgate' => 20, 'karwan_bazar' => 20,
            'shahbag' => 20, 'bangladesh_secretariat' => 20,
            'motijheel' => 20
        ],
        'bangladesh_secretariat' => [
            'uttara_north' => 90, 'uttara_center' => 90, 'uttara_south' => 80,
            'pallabi' => 70, 'mirpur_11' => 70, 'mirpur_10' => 60,
            'kazipara' => 50, 'shewrapara' => 50, 'agargaon' => 40,
            'bijoy_sarani' => 30, 'farmgate' => 30, 'karwan_bazar' => 20,
            'shahbag' => 20, 'dhaka_university' => 20, 'motijheel' => 20
        ],
        'motijheel' => [
            'uttara_north' => 100, 'uttara_center' => 100, 'uttara_south' => 90,
            'pallabi' => 80, 'mirpur_11' => 70, 'mirpur_10' => 60,
            'kazipara' => 60, 'shewrapara' => 50, 'agargaon' => 50,
            'bijoy_sarani' => 40, 'farmgate' => 30, 'karwan_bazar' => 30,
            'shahbag' => 20, 'dhaka_university' => 20,
            'bangladesh_secretariat' => 20
        ]
    ];

    /**
     * Station list
     */
    private static $stations = [
        ['id' => 'uttara_north', 'name' => 'Uttara North', 'order' => 1],
        ['id' => 'uttara_center', 'name' => 'Uttara Center', 'order' => 2],
        ['id' => 'uttara_south', 'name' => 'Uttara South', 'order' => 3],
        ['id' => 'pallabi', 'name' => 'Pallabi', 'order' => 4],
        ['id' => 'mirpur_11', 'name' => 'Mirpur 11', 'order' => 5],
        ['id' => 'mirpur_10', 'name' => 'Mirpur 10', 'order' => 6],
        ['id' => 'kazipara', 'name' => 'Kazipara', 'order' => 7],
        ['id' => 'shewrapara', 'name' => 'Shewrapara', 'order' => 8],
        ['id' => 'agargaon', 'name' => 'Agargaon', 'order' => 9],
        ['id' => 'bijoy_sarani', 'name' => 'Bijoy Sarani', 'order' => 10],
        ['id' => 'farmgate', 'name' => 'Farmgate', 'order' => 11],
        ['id' => 'karwan_bazar', 'name' => 'Karwan Bazar', 'order' => 12],
        ['id' => 'shahbag', 'name' => 'Shahbag', 'order' => 13],
        ['id' => 'dhaka_university', 'name' => 'Dhaka University', 'order' => 14],
        ['id' => 'bangladesh_secretariat', 'name' => 'Bangladesh Secretariat', 'order' => 15],
        ['id' => 'motijheel', 'name' => 'Motijheel', 'order' => 16]
    ];

    /**
     * Get fare between two stations
     *
     * @param string $from Source station ID
     * @param string $to Destination station ID
     * @return int Fare amount in BDT
     */
    public static function getFare(string $from, string $to): int
    {
        if (isset(self::$fareMatrix[$from][$to])) {
            return self::$fareMatrix[$from][$to];
        }

        // Default fare if not found in matrix
        return 20;
    }

    /**
     * Calculate total fare
     *
     * @param string $from Source station ID
     * @param string $to Destination station ID
     * @param int $quantity Number of tickets
     * @return array ['base_fare' => int, 'total_fare' => int, 'quantity' => int]
     */
    public static function calculateFare(string $from, string $to, int $quantity): array
    {
        $baseFare = self::getFare($from, $to);
        $totalFare = $baseFare * $quantity;

        return [
            'base_fare' => $baseFare,
            'total_fare' => $totalFare,
            'quantity' => $quantity
        ];
    }

    /**
     * Get all stations
     *
     * @return array List of all MRT stations
     */
    public static function getStations(): array
    {
        return self::$stations;
    }

    /**
     * Get station by ID
     *
     * @param string $stationId Station ID
     * @return array|null Station details or null if not found
     */
    public static function getStationById(string $stationId): ?array
    {
        foreach (self::$stations as $station) {
            if ($station['id'] === $stationId) {
                return $station;
            }
        }
        return null;
    }

    /**
     * Get station name by ID
     *
     * @param string $stationId Station ID
     * @return string Station name or ID if not found
     */
    public static function getStationName(string $stationId): string
    {
        $station = self::getStationById($stationId);
        return $station ? $station['name'] : $stationId;
    }

    /**
     * Verify fare calculation
     *
     * @param string $from Source station ID
     * @param string $to Destination station ID
     * @param int $quantity Number of tickets
     * @param float $expectedTotal Expected total fare
     * @return bool True if fare matches
     */
    public static function verifyFare(string $from, string $to, int $quantity, float $expectedTotal): bool
    {
        $calculated = self::calculateFare($from, $to, $quantity);
        return abs($calculated['total_fare'] - $expectedTotal) < 0.01;
    }
}
