<?php
$scriptInvokedFromCli =
    isset($_SERVER['argv'][0]) && $_SERVER['argv'][0] === 'server.php';

if($scriptInvokedFromCli) {
    $port = getenv('PORT');
    if (empty($port)) {
        $port = "4000";
    }
    echo 'starting server on port '. $port . PHP_EOL;
    exec('php -S 127.0.0.1:'. $port . ' -t ./ server.php');
} else {
    return routeRequest();
}

function routeRequest()
{

    $uri = $_SERVER['REQUEST_URI'];
    $projects = file_get_contents('projects.json');

    if ($uri == '/') {
        echo file_get_contents('./index.html');
    } elseif (preg_match('/\/api\/projects(\?.*)?/', $uri)) {
        header('Content-Type: application/json');
        header('Cache-Control: no-cache');
        echo $projects;
    } else {
        return false;
    }        
}
