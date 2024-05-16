<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CreateViewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $createCustomizedTransactionsViewQuery = "
            CREATE OR REPLACE VIEW customized_transactions_view AS
            SELECT
                t.transactionId,
                t.userId,
                u.name AS userName,
                t.amount AS originalAmount,
                ABS(t.amount) AS absoluteAmount,
                t.transactionType,
                CASE
                    WHEN t.transactionType = 'credit' THEN t.amount
                    ELSE -t.amount
                END AS DashAmount,
                'customType' AS customTransactionType,
                DATE_FORMAT(t.transactionDate, '%Y-%m-%d %H:%i:%s') AS transactionDate,
                u.userType, -- Assuming 'userType' exists in the 'users' table
                u.companyName, -- Assuming 'companyName' exists in the 'users' table
                u.phoneNumber -- Assuming 'phoneNumber' exists in the 'users' table
            FROM
                transactions t
            JOIN
                users u ON t.userId = u.userId;
        ";

        DB::statement($createCustomizedTransactionsViewQuery);
    }
}