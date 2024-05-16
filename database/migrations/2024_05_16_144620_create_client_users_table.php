<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientUsersTable extends Migration
{
    public function up()
    {
        Schema::create('client_users', function (Blueprint $table) {
            $table->id();
            $table->enum('userType', ['client', 'supplier', 'other', 'own'])->default('client');
            $table->string('name');
            $table->string('companyName');
            $table->string('phoneNumber', 20);
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->boolean('watch')->default(false);
            $table->string('balanceLimit', 30)->default('0');
            $table->boolean('blackListed')->default(false);
            $table->boolean('removed')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('client_users');
    }
}
