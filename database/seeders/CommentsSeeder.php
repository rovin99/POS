<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('comments')->insert([
            [
                'id' => 12,
                'user_id' => 203,
                'transaction_id' => null,
                'status' => 'waiting',
                'comment' => 'sasa',
                'log_date' => '2024-03-28 01:39:54',
            ],
            [
                'id' => 13,
                'user_id' => 203,
                'transaction_id' => null,
                'status' => 'waiting',
                'comment' => 'hu',
                'log_date' => '2024-03-28 01:56:55',
            ],
            [
                'id' => 14,
                'user_id' => 169,
                'transaction_id' => null,
                'status' => 'waiting',
                'comment' => 'hello',
                'log_date' => '2024-03-28 20:42:17',
            ],
            [
                'id' => 15,
                'user_id' => 105,
                'transaction_id' => null,
                'status' => 'waiting',
                'comment' => 'sharmko',
                'log_date' => '2024-04-09 13:28:43',
            ],
        ]);
    }
}