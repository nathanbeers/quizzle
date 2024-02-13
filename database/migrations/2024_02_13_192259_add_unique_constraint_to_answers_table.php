<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('answers', function (Blueprint $table) {
            // Add a unique constraint
            $table->unique(['test_id', 'email'], 'test_id_email_unique');
        });
    }

    public function down()
    {
        Schema::table('answers', function (Blueprint $table) {
            // Remove the unique constraint
            $table->dropUnique('test_id_email_unique');
        });
    }
};
