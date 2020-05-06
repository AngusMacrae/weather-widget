<?php

$success = false;

if ($_GET) {

    $city = $_GET["city"];
    
    $url = 'api.openweathermap.org/data/2.5/weather?q='.$city.'&appid=e7034c9ccb454fc5547fec12cad8b5d4';
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPGET, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response_json = curl_exec($ch);
    curl_close($ch);
    $response=json_decode($response_json, true);
    $success=true;

}

?>

<!doctype html>
<html lang="en">
    
<!--api.openweathermap.org/data/2.5/weather?q={city name}&appid=e7034c9ccb454fc5547fec12cad8b5d4-->

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="styles.css">

    <title>Weathervane</title>
</head>

<body class="container text-center">
    <h1>What's the Weather?</h1>

    <form method="get">
        <div class="form-group d-flex flex-column align-items-center">
            <label for="cityInput">Enter the name of a city.</label>
            <input type="text" name="city" class="form-control col-md-6" id="cityInput" placeholder="Eg. London, Tokyo">
        </div>
        <button type="submit" class="btn btn-primary">Go!</button>
    </form>
    
    <?php
    
    if ($success) {
        
        echo '<div class="alert alert-success col-sm-6 my-2 mx-auto"><h4 class="alert-heading">'.$city.'</h4><hr><p class="mb-0">API response goes here</p></div>';
    
    } else {
        
        echo '<div class="alert alert-danger col-sm-6 my-2 mx-auto"><h4 class="alert-heading">Enter a city name</h4><hr><p class="mb-0">API response goes here</p></div>';
        
    }
    
    ?>
    
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</body>

</html>
