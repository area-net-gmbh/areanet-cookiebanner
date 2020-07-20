<?php

if(file_exists('../../areanet-cookiebanner.php')){
    include_once('../../areanet-cookiebanner.php');
}

$secureKey = defined('ANCB_SECURE_KEY') ? ANCB_SECURE_KEY : 'efLbFK5:?.,HRM\^u/+VHB6WUhuSsHu&';
$dbPath    = defined('ANCB_DB_PATH')  ? ANCB_DB_PATH : '.htstore';


/**
 * 
 * AUDIT-LOG FOR AREANET COOKIEBANNER
 * 
 */

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

if($areaneCookiebannerProtect != $_COOKIE['areanet-cookiebanner-protect']){
    header($_SERVER["SERVER_PROTOCOL"]." 401 Unauthorized", true, 405);
    exit;
}

$startup = $startup == 'true' || $startup == 'TRUE' ? 1 : 0;

$db = new SQLite3($dbPath);
$db-> exec("
    CREATE TABLE IF NOT EXISTS audit(
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        uid TEXT NOT NULL,
        userAgent TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        startup INTEGER NO NULL,
        cookies TEXT NOT NULL
    )
");

if(function_exists('mcrypt_encrypt')) {
    $iv_size    = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB); 
    $iv         = mcrypt_create_iv($iv_size, MCRYPT_RAND); 
    
    $userAgent  = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $secureKey, $userAgent, MCRYPT_MODE_ECB, $iv));
    $cookies    = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $secureKey, json_encode($cookies), MCRYPT_MODE_ECB, $iv));
}else{
    $cookies    = json_encode($cookies);
}

$statement = "
INSERT INTO audit 
    (uid, userAgent, timestamp, startup, cookies) 
VALUES 
    ('".$db->escapeString($uid)."', '".$db->escapeString($userAgent)."', '".$db->escapeString($timestamp)."', '".$startup."', '".$db->escapeString($cookies)."')";

$db->exec($statement);