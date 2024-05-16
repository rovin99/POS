<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CreateTestViewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $createTestViewQuery = "
            CREATE OR REPLACE VIEW testview AS
            SELECT
                t.transactionId,
                t.userId,
                u.name AS userName,
                ABS(t.amount) AS absoluteAmount,
                t.amount,
                CASE
                    WHEN t.transactionType = 'credit' THEN t.amount
                    ELSE -t.amount
                END AS dasnamount,
                'customType' AS customTransactionType,
                t.transactionType,
                t.transactionDate,
                u.userType,
                u.companyName,
                u.phoneNumber
            FROM
                transactions t
            JOIN
                users u ON t.userId = u.userId;
        ";

        DB::statement($createTestViewQuery);
    }
}