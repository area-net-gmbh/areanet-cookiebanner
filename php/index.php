<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header($_SERVER["SERVER_PROTOCOL"]." 405 Method Not Allowed", true, 405);
    exit;
}

$areaneCookiebannerProtect  = filter_var($_POST['areanet-cookiebanner-protect'], FILTER_SANITIZE_STRING);
$uid                        = filter_var($_POST['uid'], FILTER_SANITIZE_STRING);
$userAgent                  = filter_var($_POST['userAgent'], FILTER_SANITIZE_STRING);
$startup                    = filter_var($_POST['startup'], FILTER_SANITIZE_STRING);
$timestamp                  = filter_var($_POST['timestamp'], FILTER_SANITIZE_STRING);

$cookiesRaw = json_decode($_POST['cookies']);

if(!$cookiesRaw){
    header($_SERVER["SERVER_PROTOCOL"]." 500 Params not valid", true, 500);
    exit;
}

$cookies = array();
foreach($cookiesRaw as $cookieName => $cookieValue){
    $cookies[filter_var($cookieName, FILTER_SANITIZE_STRING)] = $cookieValue == 'true' ? true : false;
}

echo $areaneCookiebannerProtect." == ".$_COOKIE['areanet-cookiebanner-protect'];