<?php

namespace App;


require "application.php";
require "handler.php";

class Test extends \PHPUnit_Framework_TestCase
{

    public function testClasses()
    {
        // BEGIN (write your solution here)

        // END
        $this->assertInstanceOf('App\Application', $app);

        $this->assertEquals('production', $app->stage);
        $this->assertCount(1, $app->handlers);

        $handler = $app->handlers[0];
        $this->assertInstanceOf('App\Handler', $handler);
        $this->assertEquals('default handler', $handler->name);
    }
}

