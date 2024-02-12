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
        Schema::table('tests', function (Blueprint $table) {
            // Add the hasPassword boolean column and default it to false
            $table->boolean('hasPassword')->default(false);
        });
    }

    public function down()
    {
        Schema::table('tests', function (Blueprint $table) {
            // Remove the hasPassword column if the migration is rolled back
            $table->dropColumn('hasPassword');
        });
    }
};
