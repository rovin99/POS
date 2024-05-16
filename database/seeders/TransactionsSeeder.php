<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TransactionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $transactionData = [
            [
                'transactionId' => 253,
                'userId' => 103,
                'amount' => -322724.00,
                'description' => '174 Pipe',
                'transactionType' => 'debit',
                'transactionDate' => '2024-02-23 22:14:00',
                'imageUrl' => 'images/65dbbc9f6e39a66.png',
                'transactionDueDate' => '2024-02-23',
                'logDate' => '2024-02-23 22:14:00',
                
            ],
            [
                'transactionId' => 254,
                'userId' => 103,
                'amount' => -322724.00,
                'description' => '174 Pipe',
                'transactionType' => 'debit',
                'transactionDate' => '2024-02-23 22:14:00',
                'imageUrl' => 'images/65dbbc9f6e39a66.png',
                'transactionDueDate' => '2024-02-23',
                'logDate' => '2024-02-23 22:14:00',
                
            ],
            [
                'transactionId' => 255,
                'userId' => 103,
                'amount' => -322724.00,
                'description' => '174 Pipe',
                'transactionType' => 'debit',
                'transactionDate' => '2024-02-23 22:14:00',
                'imageUrl' => 'images/65dbbc9f6e39a66.png',
                'transactionDueDate' => '2024-02-23',
                'logDate' => '2024-02-23 22:14:00',
                
            ],
            [
                'transactionId' => 256,
                'userId' => 103,
                'amount' => -322724.00,
                'description' => '174 Pipe',
                'transactionType' => 'debit',
                'transactionDate' => '2024-02-23 22:14:00',
                'imageUrl' => 'images/65dbbc9f6e39a66.png',
                'transactionDueDate' => '2024-02-23',
                'logDate' => '2024-02-23 22:14:00',
                
            ],
            
           
        ];

        DB::table('transactions')->insert($transactionData);
    }
}