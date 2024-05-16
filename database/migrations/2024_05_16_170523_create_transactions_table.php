<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->increments('transactionId');
            $table->unsignedInteger('userId')->nullable();
            $table->decimal('amount', 10, 2)->nullable(false);
            $table->string('description', 255)->nullable();
            $table->enum('transactionType', ['credit', 'debit'])->nullable(false);
            $table->dateTime('transactionDate')->nullable(false);
            $table->string('imageUrl', 255)->nullable();
            $table->date('transactionDueDate')->nullable(false);
            $table->dateTime('logDate')->useCurrent()->nullable(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions');
    }
}