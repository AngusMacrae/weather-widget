<?php

$weather = "";
$success = false;

if ($_GET) {

    $city = $_GET["city"];
    $url = 'http://api.openweathermap.org/data/2.5/weather?q='.$city.'&appid=e7034c9ccb454fc5547fec12cad8b5d4';
    $url_contents = file_get_contents($url);
    $weatherArray = json_decode($url_contents, true);
//    print_r($weatherArray);
    
    $city = $weatherArray[name];
    $country = $weatherArray[sys][country];
    $weather_desc = $weatherArray[weather][0][description];
    $weather_clouds = $weatherArray[clouds][all];
    $weather_temp = $weatherArray[main][temp] - 273.15;
    $weather_humidity = $weatherArray[main][humidity];
    $weather_windSpeed = $weatherArray[wind][speed];
    
    $weather = "The weather in ".$city." is currently '".$weather_desc."' with ".$weather_clouds."% cloud cover. The temperature is ".$weather_temp." degrees C and the humidity is ".$weather_humidity."%. The wind speed is ".$weather_windSpeed." m/s.";
    
    $success = true;

}

?>

<!doctype html>
<html lang="en">


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
        <div class=" form-group">
            <label for="cityInput">Enter the name of a city.</label>
            <div class="form-row">
                <div class="col">
                    <input type="text" name="city" class="form-control" id="cityInput" placeholder="Eg. London, Tokyo">
                    <button type="submit" class="btn btn-primary">Go!</button>
                </div>
            </div>
        </div>
    </form>

    <?php
    
    if ($success) {
        
        echo '<div class="alert alert-success col-sm-6 my-2 mx-auto"><h4 class="alert-heading">'.$city.', '.$country.'</h4><hr><p class="mb-0"></p>'.$weather.'</div>';
        
    }
    
    ?>

    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</body>

</html>
