<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('admin_user')->insert([
            [
                'userID' => 1,
                'username' => 'AA',
                'password' => Hash::make('password'),
                'email' => 'aa@aatech.dk',
                'adminType' => 'Admin',
                'phoneNumber' => '28910515',
                'created_at' => '2024-03-10 00:23:11',
                'updated_at' => '2024-03-10 00:23:11'
            ],
            [
                'userID' => 2,
                'username' => 'Kaleem',
                'password' => Hash::make('password'),
                'email' => 'kk@kk.dk',
                'adminType' => 'SuperAdmin',
                'phoneNumber' => '03007050000',
                'created_at' => '2024-03-10 01:35:11',
                'updated_at' => '2024-03-10 01:35:11'
            ]
        ]);
    }
}