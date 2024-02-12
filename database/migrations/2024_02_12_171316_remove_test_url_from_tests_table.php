<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('tests', function (Blueprint $table) {
            // Check if the column exists before trying to drop it
            if (Schema::hasColumn('tests', 'test_url')) {
                $table->dropColumn('test_url');
            }
        });
    }

    public function down()
    {
        Schema::table('tests', function (Blueprint $table) {
            // Recreate the 'test_url' column as it was before
            $table->string('test_url'); // Adjust the column definition as needed
        });
    }
};

