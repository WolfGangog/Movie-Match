<?php
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["title"])) {
    $title = $_GET["title"];
    $jsonFile = "uploads/media.json";

    if (!file_exists($jsonFile)) {
        echo "Error: Media database not found.";
        exit;
    }

    $data = json_decode(file_get_contents($jsonFile), true);
    $updatedData = [];

    foreach ($data as $item) {
        if ($item["title"] === $title) {
            $filePath = $item["file"];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        } else {
            $updatedData[] = $item;
        }
    }

    file_put_contents($jsonFile, json_encode($updatedData, JSON_PRETTY_PRINT));
    echo "Media deleted successfully.";
} else {
    echo "Invalid request.";
}
?>
