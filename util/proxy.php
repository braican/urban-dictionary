<?php

	function strip_cdata($string) {   
		preg_match_all('/<!\[cdata\[(.*?)\]\]>/is', $string, $matches);
		return str_replace($matches[0], $matches[1], $string);
	}

	$ch = curl_init();
	// $url = $_GET['url'];
	$url = 'http://www.urbandictionary.com/random.php';
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_USERAGENT, $user_agent);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	curl_setopt($ch, CURLOPT_HEADER, 0);

	$result = curl_exec($ch);

	curl_close($ch);

	$stripped = strip_cdata($result);

	$decode = html_entity_decode($stripped);

	echo $decode;

?>