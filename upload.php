<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "moviematch";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['movie_file'])) {
    $movieTitle = $_POST['movie_title'];
    $targetDir = "uploads/movies/";
    $targetFile = $targetDir . basename($_FILES['movie_file']['name']);

    if (move_uploaded_file($_FILES['movie_file']['tmp_name'], $targetFile)) {
        $stmt = $conn->prepare("INSERT INTO movies (title, file_path) VALUES (?, ?)");
        $stmt->bind_param("ss", $movieTitle, $targetFile);
        $stmt->execute();
        header("Location: dashboard.php");
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['series_files'])) {
    $seriesName = $_POST['series_name'];
    $targetDir = "uploads/series/$seriesName/";
    mkdir($targetDir, 0777, true);

    foreach ($_FILES['series_files']['name'] as $index => $fileName) {
        $targetFile = $targetDir . basename($fileName);
        if (move_uploaded_file($_FILES['series_files']['tmp_name'][$index], $targetFile)) {
            $stmt = $conn->prepare("INSERT INTO series (name, file_path) VALUES (?, ?)");
            $stmt->bind_param("ss", $seriesName, $targetFile);
            $stmt->execute();
        }
    }
    header("Location: dashboard.php");
    exit();
}

if (isset($_GET['delete_movie'])) {
    $id = $_GET['delete_movie'];
    $conn->query("DELETE FROM movies WHERE id=$id");
    header("Location: dashboard.php");
    exit();
}

if (isset($_GET['delete_series'])) {
    $name = $_GET['delete_series'];
    $conn->query("DELETE FROM series WHERE name='$name'");
    header("Location: dashboard.php");
    exit();
}

$result = $conn->query("SELECT * FROM movies");
$movies = [];
while ($row = $result->fetch_assoc()) {
    $movies[] = $row;
}

$result = $conn->query("SELECT DISTINCT name FROM series");
$series = [];
while ($row = $result->fetch_assoc()) {
    $series[] = $row;
}
$conn->close();
?>