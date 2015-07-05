<?php
$scriptInvokedFromCli =
    isset($_SERVER['argv'][0]) && $_SERVER['argv'][0] === 'server.php';

if($scriptInvokedFromCli) {
    echo 'starting server on port 4000' . PHP_EOL;
    exec('php -S localhost:4000 -t ./ server.php');
} else {
    return routeRequest();
}

function routeRequest()
{

    

    switch($_SERVER["REQUEST_URI"]) {
        case '/':
            echo file_get_contents('./index.html');
            break;
     	default:
            return false;
        }
}